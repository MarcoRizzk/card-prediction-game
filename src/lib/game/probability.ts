import { createStandardDeck } from "./deck";
import type { GameState } from "./types";
import { cardValue } from "./values";

export type NextCardProbabilities = {
  higher: number; // 0..1
  lower: number; // 0..1
  tie: number; // 0..1
  totalOutcomes: number;
  source: "deck" | "reshuffle";
};

export function nextCardProbabilities(state: GameState): NextCardProbabilities | null {
  if (state.status !== "playing") return null;

  const prevValue = cardValue(state.currentCard, state.faceValues);

  let population = state.deck;
  let source: NextCardProbabilities["source"] = "deck";

  if (population.length === 0) {
    if (state.reshufflesUsed >= state.maxReshuffles) return null;
    population = createStandardDeck();
    source = "reshuffle";
  }

  let higher = 0;
  let lower = 0;
  let tie = 0;

  for (const c of population) {
    const v = cardValue(c, state.faceValues);
    if (v > prevValue) higher += 1;
    else if (v < prevValue) lower += 1;
    else tie += 1;
  }

  const total = population.length;
  return {
    higher: total === 0 ? 0 : higher / total,
    lower: total === 0 ? 0 : lower / total,
    tie: total === 0 ? 0 : tie / total,
    totalOutcomes: total,
    source,
  };
}

