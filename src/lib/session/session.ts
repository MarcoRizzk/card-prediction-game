import { cookies } from "next/headers";
import {
  getIronSession,
  type IronSession,
  type SessionOptions,
} from "iron-session";
import type { GameState } from "@/lib/game/types";

type SessionData = {
  game?: GameState;
};

export type GameSession = IronSession<SessionData>;

function requireSessionPassword(): string {
  const password = process.env.SESSION_PASSWORD;
  if (!password) {
    throw new Error(
      "Missing SESSION_PASSWORD. Create a .env.local with a strong password (32+ chars).",
    );
  }
  if (password.length < 32) {
    throw new Error("SESSION_PASSWORD must be at least 32 characters long.");
  }
  return password;
}

export const sessionOptions: SessionOptions = {
  cookieName: "hl_session",
  password: requireSessionPassword(),
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
