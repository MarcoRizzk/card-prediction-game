import { NextResponse } from "next/server";
import { toPublicState } from "@/lib/game/engine";
import { getSession } from "@/lib/session/session";
import type { GameStateResponseDto } from "@/lib/dtos";

export async function GET() {
  const session = await getSession();
  if (!session.game) {
    const response: GameStateResponseDto = { hasGame: false };
    return NextResponse.json(response);
  }
  const response: GameStateResponseDto = { hasGame: true, game: toPublicState(session.game) };
  return NextResponse.json(response);
}

