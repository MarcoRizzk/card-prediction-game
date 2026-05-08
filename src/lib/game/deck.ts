import type { Card, Rank, Rng, Suit } from "./types";

const suits: Suit[] = ["C", "D", "H", "S"];
const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function createStandardDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  // Fisher–Yates (pure; returns a new array)
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function drawTop(deck: Card[]): { card: Card; rest: Card[] } {
  if (deck.length === 0) {
    throw new Error("Cannot draw from empty deck");
  }
  return { card: deck[0], rest: deck.slice(1) };
}
