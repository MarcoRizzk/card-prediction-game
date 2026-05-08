import type { CardDto, FaceValuesDto, FaceRank } from "@/lib/dtos";

const suitSymbol: Record<CardDto["suit"], string> = {
  C: "♣",
  D: "♦",
  H: "♥",
  S: "♠",
};

function isRedSuit(suit: CardDto["suit"]) {
  return suit === "D" || suit === "H";
}

function isFaceRank(rank: CardDto["rank"]): rank is FaceRank {
  return rank === "J" || rank === "Q" || rank === "K";
}

export type CardAnimationKind = "swap" | "shuffle" | "reveal";

export function CardView({
  card,
  faceValues,
  animation,
  animationKey,
}: {
  card: CardDto;
  faceValues?: FaceValuesDto;
  animation?: CardAnimationKind;
  animationKey?: number;
}) {
  const symbol = suitSymbol[card.suit];
  const red = isRedSuit(card.suit);
  const faceValue =
    faceValues && isFaceRank(card.rank) ? faceValues[card.rank] : undefined;
  const animClass =
    animation === "shuffle"
      ? "card-shuffle"
      : animation === "swap"
        ? "card-flip-in"
        : animation === "reveal"
          ? "card-reveal"
          : "";
  return (
    <div
      key={animationKey}
      className={[
        "card-perspective relative w-full max-w-sm rounded-3xl border border-zinc-200 bg-white shadow-sm will-change-transform",
        "dark:border-zinc-800 dark:bg-zinc-950",
        animClass,
      ].join(" ")}
    >
      <div className="absolute left-4 top-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        Current card
      </div>
      {typeof faceValue === "number" ? (
        <div className="absolute right-4 top-4 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
          Value {faceValue}
        </div>
      ) : null}

      <div className="flex h-[220px] items-center justify-center px-6">
        <div
          className={[
            "flex items-baseline gap-3 font-black tracking-tight",
            red ? "text-red-600 dark:text-red-500" : "text-zinc-950 dark:text-zinc-50",
          ].join(" ")}
        >
          <span className="text-7xl leading-none">{card.rank}</span>
          <span className="text-6xl leading-none">{symbol}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-900 dark:text-zinc-300">
        <span>
          Suit <span className="font-medium text-zinc-900 dark:text-zinc-50">{symbol}</span>
        </span>
        <span className="text-zinc-400 dark:text-zinc-500">52-card deck</span>
      </div>
    </div>
  );
}

