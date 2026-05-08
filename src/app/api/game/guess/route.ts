import { NextResponse } from "next/server";
import { applyGuess, toPublicState } from "@/lib/game/engine";
import type { GuessDto, GuessRequestDto, GuessResponseDto } from "@/lib/dtos";
import { getSession } from "@/lib/session/session";

function isGuess(v: unknown): v is GuessDto {
  return v === "higher" || v === "lower";
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.game) {
    return NextResponse.json({ error: "No active game. Call /api/game/start first." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const guess = (body as GuessRequestDto | { guess?: unknown })?.guess;
  if (!isGuess(guess)) {
    return NextResponse.json({ error: 'guess must be "higher" or "lower"' }, { status: 400 });
  }

  const { state: nextState, result } = applyGuess(session.game, guess);
  session.game = nextState;
  await session.save();

  const response: GuessResponseDto = { result, game: toPublicState(nextState) };
  return NextResponse.json(response);
}

