export type ProbabilityDto = {
  higher: number;
  lower: number;
  tie: number;
  totalOutcomes: number;
  source: "deck" | "reshuffle";
};

export type ProbabilityResponseDto = {
  probability: ProbabilityDto;
};

