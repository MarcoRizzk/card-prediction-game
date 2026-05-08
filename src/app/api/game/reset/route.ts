import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import type { ResetResponseDto } from "@/lib/dtos";

export async function POST() {
  const session = await getSession();
  session.game = undefined;
  await session.save();
  const response: ResetResponseDto = { ok: true };
  return NextResponse.json(response);
}

