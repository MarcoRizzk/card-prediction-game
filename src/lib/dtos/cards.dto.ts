// C=Clubs, D=Diamonds, H=Hearts, S=Spades
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

// J=Jack, Q=Queen, K=King
export type FaceRank = "J" | "Q" | "K";

export type CardDto = {
  rank: Rank;
  suit: Suit;
};
