import { createStandardDeck, drawTop, shuffle } from "./deck";
import type { Card, FaceRank, FaceValues, GameConfig, GameState, Guess, GuessResult, Rng } from "./types";
import { cardValue, clampFaceValue, isFaceRank } from "./values";

function defaultFaceValues(): FaceValues {
  return { J: 5, Q: 5, K: 5 };
}

export function toPublicState(state: GameState) {
  return {
    status: state.status,
    currentCard: state.currentCard,
    score: state.score,
    streak: state.streak,
    faceValues: state.faceValues,
    reshufflesUsed: state.reshufflesUsed,
    maxReshuffles: state.maxReshuffles,
    remainingInDeck: state.deck.length,
  };
}

export function initGame(config: GameConfig, rng: Rng = Math.random): GameState {
  const shuffled = shuffle(createStandardDeck(), rng);
  const { card: first, rest } = drawTop(shuffled);
  return {
    status: "playing",
    currentCard: first,
    deck: rest,
    score: 0,
    streak: 0,
    faceValues: defaultFaceValues(),
    reshufflesUsed: 0,
    maxReshuffles: config.maxReshuffles,
  };
}

function ensureNextCard(state: GameState, rng: Rng): { nextCard?: Card; nextDeck: Card[]; didReshuffle: boolean; reshufflesUsed: number } {
  if (state.deck.length > 0) {
    const { card, rest } = drawTop(state.deck);
    return { nextCard: card, nextDeck: rest, didReshuffle: false, reshufflesUsed: state.reshufflesUsed };
  }

  if (state.reshufflesUsed >= state.maxReshuffles) {
    return { nextCard: undefined, nextDeck: [], didReshuffle: false, reshufflesUsed: state.reshufflesUsed };
  }

  const reshuffled = shuffle(createStandardDeck(), rng);
  const { card, rest } = drawTop(reshuffled);
  return { nextCard: card, nextDeck: rest, didReshuffle: true, reshufflesUsed: state.reshufflesUsed + 1 };
}

function involvedFaceRanks(prev: Card, next: Card): FaceRank[] {
  const set = new Set<FaceRank>();
  if (isFaceRank(prev.rank)) set.add(prev.rank);
  if (isFaceRank(next.rank)) set.add(next.rank);
  return Array.from(set);
}

export function applyGuess(state: GameState, guess: Guess, rng: Rng = Math.random): { state: GameState; result: GuessResult } {
  if (state.status !== "playing") {
    return {
      state,
      result: {
        kind: "finished",
        previousCard: state.currentCard,
        didReshuffle: false,
        reshufflesUsed: state.reshufflesUsed,
        message: "Game is already finished.",
        faceValueDeltas: {},
      },
    };
  }

  const previousCard = state.currentCard;
  const { nextCard, nextDeck, didReshuffle, reshufflesUsed } = ensureNextCard(state, rng);

  if (!nextCard) {
    const finished: GameState = { ...state, status: "finished", deck: [], reshufflesUsed };
    return {
      state: finished,
      result: {
        kind: "finished",
        previousCard,
        didReshuffle: false,
        reshufflesUsed,
        message: "No reshuffles remaining — game over.",
        faceValueDeltas: {},
      },
    };
  }

  const prevValue = cardValue(previousCard, state.faceValues);
  const nextValue = cardValue(nextCard, state.faceValues);

  let kind: GuessResult["kind"];
  let scoreDelta = 0;
  let streak = state.streak;
  const faceValueDeltas: Partial<Record<FaceRank, number>> = {};

  if (nextValue === prevValue) {
    kind = "tie";
    streak = 0;
  } else {
    const isCorrect = guess === "higher" ? nextValue > prevValue : nextValue < prevValue;
    kind = isCorrect ? "correct" : "wrong";
    if (isCorrect) {
      scoreDelta = 1;
      streak = streak + 1;
    } else {
      scoreDelta = -1;
      streak = 0;
    }

    const delta = isCorrect ? 1 : -1;
    for (const r of involvedFaceRanks(previousCard, nextCard)) {
      faceValueDeltas[r] = delta;
    }
  }

  const nextFaceValues: FaceValues = { ...state.faceValues };
  for (const [rank, delta] of Object.entries(faceValueDeltas) as Array<[FaceRank, number]>) {
    nextFaceValues[rank] = clampFaceValue(nextFaceValues[rank] + delta);
  }

  const nextState: GameState = {
    ...state,
    currentCard: nextCard,
    deck: nextDeck,
    score: state.score + scoreDelta,
    streak,
    faceValues: nextFaceValues,
    reshufflesUsed,
  };

  const message =
    kind === "correct"
      ? "Correct — +1 point."
      : kind === "wrong"
        ? "Wrong — -1 point, game continues."
        : "Tie — no points, values unchanged.";

  return {
    state: nextState,
    result: {
      kind,
      previousCard,
      nextCard,
      didReshuffle,
      reshufflesUsed,
      message,
      faceValueDeltas,
    },
  };
}

