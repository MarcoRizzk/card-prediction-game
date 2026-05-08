import type { Card, FaceRank, FaceValues, Rank } from "./types";

export function isFaceRank(rank: Rank): rank is FaceRank {
  return rank === "J" || rank === "Q" || rank === "K";
}

export function rankValue(rank: Rank, faceValues: FaceValues): number {
  if (rank === "A") return 1;
  if (rank === "J" || rank === "Q" || rank === "K") return faceValues[rank];
  return Number(rank);
}

export function cardValue(card: Card, faceValues: FaceValues): number {
  return rankValue(card.rank, faceValues);
}

export function clampFaceValue(v: number): number {
  return Math.max(1, Math.min(10, v));
}
