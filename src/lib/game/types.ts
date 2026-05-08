export type Suit = "C" | "D" | "H" | "S";

export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export type FaceRank = "J" | "Q" | "K";

export type Card = {
  rank: Rank;
  suit: Suit;
};

export type Guess = "higher" | "lower";

export type GameStatus = "playing" | "finished";

export type FaceValues = Record<FaceRank, number>;

export type GameConfig = {
  maxReshuffles: 3 | 5 | 7;
};

export type GameState = {
  status: GameStatus;
  deck: Card[]; // remaining, top is index 0
  currentCard: Card;
  score: number;
  streak: number;
  faceValues: FaceValues;
  reshufflesUsed: number;
  maxReshuffles: GameConfig["maxReshuffles"];
};

export type PublicGameState = {
  status: GameStatus;
  currentCard: Card;
  score: number;
  streak: number;
  faceValues: FaceValues;
  reshufflesUsed: number;
  maxReshuffles: GameConfig["maxReshuffles"];
  remainingInDeck: number;
};

export type GuessResultKind = "correct" | "wrong" | "tie" | "finished";

export type GuessResult = {
  kind: GuessResultKind;
  previousCard: Card;
  nextCard?: Card;
  didReshuffle: boolean;
  reshufflesUsed: number;
  message: string;
  faceValueDeltas: Partial<Record<FaceRank, number>>;
};

export type Rng = () => number;
