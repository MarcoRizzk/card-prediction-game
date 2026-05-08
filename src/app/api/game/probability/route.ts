import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { nextCardProbabilities } from "@/lib/game/probability";
import type { ProbabilityResponseDto } from "@/lib/dtos";

export async function GET() {
  const session = await getSession();
  if (!session.game) {
    return NextResponse.json({ error: "No active game. Call /api/game/start first." }, { status: 400 });
  }

  const probability = nextCardProbabilities(session.game);
  if (!probability) {
    return NextResponse.json({ error: "Game is finished (or no next card can be drawn)." }, { status: 400 });
  }

  const response: ProbabilityResponseDto = { probability };
  return NextResponse.json(response);
}

