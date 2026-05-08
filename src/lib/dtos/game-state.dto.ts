import type { CardDto, FaceRank } from "./cards.dto";

export type GuessDto = "higher" | "lower";

export type GameStatusDto = "playing" | "finished";

export type FaceValuesDto = Record<FaceRank, number>;

export type PublicGameStateDto = {
  status: GameStatusDto;
  currentCard: CardDto;
  score: number;
  streak: number;
  faceValues: FaceValuesDto;
  reshufflesUsed: number;
  maxReshuffles: 3 | 5 | 7;
  remainingInDeck: number;
};

export type GuessResultKindDto = "correct" | "wrong" | "tie" | "finished";

export type GuessResultDto = {
  kind: GuessResultKindDto;
  previousCard: CardDto;
  nextCard?: CardDto;
  didReshuffle: boolean;
  reshufflesUsed: number;
  message: string;
  faceValueDeltas: Partial<Record<FaceRank, number>>;
};

