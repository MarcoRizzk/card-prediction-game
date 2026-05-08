import { NextResponse } from "next/server";
import { initGame, toPublicState } from "@/lib/game/engine";
import { getSession } from "@/lib/session/session";
import type { StartGameRequestDto, StartGameResponseDto } from "@/lib/dtos";

function isMaxReshuffles(v: unknown): v is 3 | 5 | 7 {
  return v === 3 || v === 5 || v === 7;
}

export async function POST(req: Request) {
  const session = await getSession();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const maxReshuffles = (body as StartGameRequestDto | { maxReshuffles?: unknown })?.maxReshuffles;
  if (!isMaxReshuffles(maxReshuffles)) {
    return NextResponse.json({ error: "maxReshuffles must be 3, 5, or 7" }, { status: 400 });
  }

  session.game = initGame({ maxReshuffles });
  await session.save();

  const response: StartGameResponseDto = { game: toPublicState(session.game) };
  return NextResponse.json(response);
}

