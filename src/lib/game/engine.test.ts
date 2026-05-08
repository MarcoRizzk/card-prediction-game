import { describe, expect, it } from "vitest";
import type { Card, GameState } from "./types";
import { applyGuess } from "./engine";

function card(rank: Card["rank"], suit: Card["suit"] = "H"): Card {
  return { rank, suit };
}

const rngZero = () => 0;

describe("applyGuess", () => {
  it("treats equal values as tie (neutral)", () => {
    const state: GameState = {
      status: "playing",
      currentCard: card("7"),
      deck: [card("7", "S")],
      score: 3,
      streak: 2,
      faceValues: { J: 5, Q: 5, K: 5 },
      reshufflesUsed: 0,
      maxReshuffles: 3,
    };

    const { state: next, result } = applyGuess(state, "higher", rngZero);

    expect(result.kind).toBe("tie");
    expect(next.score).toBe(3);
    expect(next.streak).toBe(0);
    expect(next.faceValues).toEqual({ J: 5, Q: 5, K: 5 });
  });

  it("scores +1 on correct guess and increments streak", () => {
    const state: GameState = {
      status: "playing",
      currentCard: card("7"),
      deck: [card("9")],
      score: 0,
      streak: 0,
      faceValues: { J: 5, Q: 5, K: 5 },
      reshufflesUsed: 0,
      maxReshuffles: 3,
    };

    const { state: next, result } = applyGuess(state, "higher", rngZero);

    expect(result.kind).toBe("correct");
    expect(next.score).toBe(1);
    expect(next.streak).toBe(1);
  });

  it("does not change score on wrong guess and resets streak", () => {
    const state: GameState = {
      status: "playing",
      currentCard: card("9"),
      deck: [card("7")],
      score: 4,
      streak: 3,
      faceValues: { J: 5, Q: 5, K: 5 },
      reshufflesUsed: 0,
      maxReshuffles: 3,
    };

    const { state: next, result } = applyGuess(state, "higher", rngZero);

    expect(result.kind).toBe("wrong");
    expect(next.score).toBe(3);
    expect(next.streak).toBe(0);
  });

  it("mutates face value when face card is current", () => {
    const state: GameState = {
      status: "playing",
      currentCard: card("J"),
      deck: [card("8")],
      score: 0,
      streak: 0,
      faceValues: { J: 5, Q: 5, K: 5 },
      reshufflesUsed: 0,
      maxReshuffles: 3,
    };

    const { state: next, result } = applyGuess(state, "higher", rngZero);

    expect(result.kind).toBe("correct");
    expect(result.faceValueDeltas).toEqual({ J: 1 });
    expect(next.faceValues.J).toBe(6);
  });

  it("mutates face value when face card is next", () => {
    const state: GameState = {
      status: "playing",
      currentCard: card("4"),
      deck: [card("Q")],
      score: 0,
      streak: 0,
      faceValues: { J: 5, Q: 5, K: 5 },
      reshufflesUsed: 0,
      maxReshuffles: 3,
    };

    const { state: next, result } = applyGuess(state, "higher", rngZero);

    expect(result.kind).toBe("correct");
    expect(result.faceValueDeltas).toEqual({ Q: 1 });
    expect(next.faceValues.Q).toBe(6);
  });

  it("clamps face values to [1..10]", () => {
    const state: GameState = {
      status: "playing",
      currentCard: card("J"),
      deck: [card("2")],
      score: 0,
      streak: 0,
      faceValues: { J: 1, Q: 5, K: 5 },
      reshufflesUsed: 0,
      maxReshuffles: 3,
    };

    // J(1), next is 2; guessing lower is wrong => delta -1 involving J, but clamp stays at 1
    const { state: next, result } = applyGuess(state, "lower", rngZero);
    expect(result.kind).toBe("wrong");
    expect(next.faceValues.J).toBe(1);
  });

  it("reshuffles seamlessly when deck is empty (if reshuffles remain)", () => {
    const state: GameState = {
      status: "playing",
      currentCard: card("7"),
      deck: [],
      score: 0,
      streak: 0,
      faceValues: { J: 5, Q: 5, K: 5 },
      reshufflesUsed: 0,
      maxReshuffles: 3,
    };

    const { state: next, result } = applyGuess(state, "higher", rngZero);
    expect(result.didReshuffle).toBe(true);
    expect(next.reshufflesUsed).toBe(1);
    expect(next.currentCard).toEqual(result.nextCard);
  });

  it("finishes game when deck is empty and reshuffles are exhausted", () => {
    const state: GameState = {
      status: "playing",
      currentCard: card("7"),
      deck: [],
      score: 2,
      streak: 1,
      faceValues: { J: 5, Q: 5, K: 5 },
      reshufflesUsed: 3,
      maxReshuffles: 3,
    };

    const { state: next, result } = applyGuess(state, "higher", rngZero);
    expect(result.kind).toBe("finished");
    expect(next.status).toBe("finished");
    expect(next.score).toBe(2);
  });
});

