import type { GuessResultDto } from "@/lib/dtos";
import { Badge } from "@/components/ui/Badge";

export function OutcomeBanner({
  result,
  faceValues,
}: {
  result: GuessResultDto;
  faceValues: { J: number; Q: number; K: number };
}) {
  const variant =
    result.kind === "correct"
      ? "success"
      : result.kind === "wrong"
        ? "warning"
        : result.kind === "tie"
          ? "muted"
          : "default";

  const title =
    result.kind === "correct"
      ? "Correct"
      : result.kind === "wrong"
        ? "Wrong"
        : result.kind === "tie"
          ? "Tie"
          : "Finished";

  const faceUpdates = Object.entries(result.faceValueDeltas);

  return (
    <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/60 dark:ring-zinc-800">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={variant}>{title}</Badge>
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{result.message}</div>
        {result.didReshuffle ? <Badge variant="muted">Deck reshuffled</Badge> : null}
      </div>

      {faceUpdates.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-700 dark:text-zinc-200">
          {faceUpdates.map(([rank, delta]) => {
            const d = Number(delta);
            const sign = d >= 0 ? "+" : "";
            const now = faceValues[rank as "J" | "Q" | "K"];
            return (
              <span
                key={rank}
                className="rounded-full bg-zinc-100 px-3 py-1 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
              >
                <span className="font-semibold">{rank}</span> {sign}
                {d} <span className="text-zinc-500 dark:text-zinc-400">(now {now})</span>
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

