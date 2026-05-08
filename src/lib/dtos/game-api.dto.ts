import type { GuessDto, GuessResultDto, PublicGameStateDto } from "./game-state.dto";

export type StartGameRequestDto = {
  maxReshuffles: 3 | 5 | 7;
};

export type StartGameResponseDto = {
  game: PublicGameStateDto;
};

export type GameStateResponseDto =
  | { hasGame: false }
  | { hasGame: true; game: PublicGameStateDto };

export type GuessRequestDto = {
  guess: GuessDto;
};

export type GuessResponseDto = {
  result: GuessResultDto;
  game: PublicGameStateDto;
};

export type ResetResponseDto = {
  ok: true;
};

