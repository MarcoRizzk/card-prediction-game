"use client";

import * as React from "react";
import type {
  GameStateResponseDto,
  GuessResponseDto,
  GuessResultDto,
  ProbabilityResponseDto,
  PublicGameStateDto,
  ResetResponseDto,
  StartGameResponseDto,
} from "@/lib/dtos";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CardView } from "@/components/CardView";
import { OutcomeBanner } from "@/components/OutcomeBanner";
import { StatsBar } from "@/components/StatsBar";
import { Modal } from "@/components/ui/Modal";

type LoadState =
  | { kind: "loading" }
  | { kind: "noGame" }
  | { kind: "ready"; game: PublicGameStateDto; lastResult?: GuessResultDto }
  | { kind: "error"; message: string };

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = (await res.json().catch(() => ({}))) as unknown;
  if (!res.ok) {
    const msg = (data as { error?: string })?.error ?? `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export function GameBoard() {
  const [state, setState] = React.useState<LoadState>({ kind: "loading" });
  const [busy, setBusy] = React.useState(false);
  const [maxReshuffles, setMaxReshuffles] = React.useState<3 | 5 | 7>(3);
  const [probOpen, setProbOpen] = React.useState(false);
  const [probBusy, setProbBusy] = React.useState(false);
  const [prob, setProb] = React.useState<ProbabilityResponseDto["probability"] | null>(null);
  const [probError, setProbError] = React.useState<string | null>(null);
  const [cardAnimKey, setCardAnimKey] = React.useState(0);
  const [cardAnimKind, setCardAnimKind] = React.useState<"reveal" | "swap" | "shuffle">("reveal");

  React.useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await jsonFetch<GameStateResponseDto>("/api/game/state");
        if (ignore) return;
        if (!data.hasGame) setState({ kind: "noGame" });
        else {
          setState({ kind: "ready", game: data.game });
          setCardAnimKind("reveal");
          setCardAnimKey((k) => k + 1);
        }
      } catch (e) {
        if (ignore) return;
        setState({ kind: "error", message: e instanceof Error ? e.message : "Failed to load game." });
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  async function startGame() {
    setBusy(true);
    try {
      const data = await jsonFetch<StartGameResponseDto>("/api/game/start", {
        method: "POST",
        body: JSON.stringify({ maxReshuffles }),
      });
      setState({ kind: "ready", game: data.game });
      setCardAnimKind("reveal");
      setCardAnimKey((k) => k + 1);
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Failed to start game." });
    } finally {
      setBusy(false);
    }
  }

  async function resetGame() {
    setBusy(true);
    try {
      await jsonFetch<ResetResponseDto>("/api/game/reset", { method: "POST", body: JSON.stringify({}) });
      setState({ kind: "noGame" });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Failed to reset game." });
    } finally {
      setBusy(false);
    }
  }

  async function makeGuess(guess: "higher" | "lower") {
    if (state.kind !== "ready") return;
    setBusy(true);
    try {
      const data = await jsonFetch<GuessResponseDto>("/api/game/guess", {
        method: "POST",
        body: JSON.stringify({ guess }),
      });
      setState({ kind: "ready", game: data.game, lastResult: data.result });
      setCardAnimKind(data.result.didReshuffle ? "shuffle" : "swap");
      setCardAnimKey((k) => k + 1);
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Failed to submit guess." });
    } finally {
      setBusy(false);
    }
  }

  async function openProbability() {
    setProbOpen(true);
    setProbError(null);
    setProb(null);
    setProbBusy(true);
    try {
      const data = await jsonFetch<ProbabilityResponseDto>("/api/game/probability");
      setProb(data.probability);
    } catch (e) {
      setProbError(e instanceof Error ? e.message : "Failed to load probability.");
    } finally {
      setProbBusy(false);
    }
  }

  function closeProbability() {
    setProbOpen(false);
  }

  function pct(x: number) {
    return `${(x * 100).toFixed(1)}%`;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Higher or Lower
          </div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Guess whether the next card will be higher or lower. Ties are neutral.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => void openProbability()}
            disabled={busy || state.kind !== "ready"}
            title={state.kind !== "ready" ? "Start a game to view probability" : "View higher/lower probability"}
          >
            Probability
          </Button>
          <Button variant="ghost" onClick={() => void resetGame()} disabled={busy}>
            Reset
          </Button>
        </div>
      </div>

      {state.kind === "loading" ? (
        <Card className="p-6">
          <div className="text-sm text-zinc-600 dark:text-zinc-300">Loading…</div>
        </Card>
      ) : state.kind === "error" ? (
        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">Something went wrong</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{state.message}</div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => window.location.reload()} disabled={busy}>
                Reload page
              </Button>
              <Button variant="ghost" onClick={() => void resetGame()} disabled={busy}>
                Reset session
              </Button>
            </div>
          </div>
        </Card>
      ) : state.kind === "noGame" ? (
        <Card className="p-6">
          <div className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Start a new game</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Choose how many reshuffles you want before the game ends.
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[3, 5, 7].map((n) => {
              const v = n as 3 | 5 | 7;
              const selected = maxReshuffles === v;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMaxReshuffles(v)}
                  className={[
                    "rounded-2xl border p-4 text-left transition-colors",
                    selected
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
                  ].join(" ")}
                >
                  <div className="text-sm font-semibold">Max reshuffles</div>
                  <div className="mt-1 text-2xl font-black tracking-tight">{n}</div>
                  <div className="mt-1 text-sm opacity-80">
                    {n === 3 ? "Quick session" : n === 5 ? "Balanced" : "Longer run"}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Face cards (J/Q/K) learn during play and persist across reshuffles.
            </div>
            <Button onClick={() => void startGame()} disabled={busy}>
              Start game
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-5">
            <StatsBar game={state.game} />
            <CardView
              card={state.game.currentCard}
              faceValues={state.game.faceValues}
              animation={cardAnimKind}
              animationKey={cardAnimKey}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                size="lg"
                onClick={() => void makeGuess("higher")}
                disabled={busy || state.game.status !== "playing"}
              >
                Higher
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => void makeGuess("lower")}
                disabled={busy || state.game.status !== "playing"}
              >
                Lower
              </Button>
            </div>

            {state.game.status === "finished" ? (
              <Card className="p-6">
                <div className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Game over</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  Final score: <span className="font-semibold">{state.game.score}</span>
                </div>
                <div className="mt-4">
                  <Button onClick={() => void resetGame()} disabled={busy}>
                    Play again
                  </Button>
                </div>
              </Card>
            ) : null}
          </div>

          <div className="space-y-5">
            {state.lastResult ? (
              <OutcomeBanner result={state.lastResult} faceValues={state.game.faceValues} />
            ) : (
              <Card className="p-6">
                <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">Make your first guess</div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  Tip: Aces are low (1). J/Q/K start at 5 and change based on outcomes when involved.
                </div>
              </Card>
            )}

            <Card className="p-6">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Rules snapshot</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <li>
                  - Correct: <span className="font-medium">+1</span> point
                </li>
                <li>
                  - Wrong: <span className="font-medium">-1</span> point (game continues)
                </li>
                <li>
                  - Tie: <span className="font-medium">neutral</span> (no score, no face-card change)
                </li>
                <li>- Deck reshuffles automatically when empty until max reshuffles are used</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      <Modal open={probOpen} onClose={closeProbability} title="Next-card probability">
        {state.kind !== "ready" ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-300">Start a game to view probability.</div>
        ) : probBusy ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-300">Calculating…</div>
        ) : probError ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-300">{probError}</div>
        ) : prob ? (
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Based on{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {prob.totalOutcomes}
              </span>{" "}
              possible next cards{" "}
              {prob.source === "reshuffle" ? (
                <span className="text-zinc-500 dark:text-zinc-400">(fresh deck after reshuffle)</span>
              ) : null}
              .
            </div>

            <div className="mt-5 space-y-3">
              {([
                ["Higher", prob.higher, "bg-emerald-500"],
                ["Lower", prob.lower, "bg-indigo-500"],
                ["Tie", prob.tie, "bg-zinc-400"],
              ] as const).map(([label, value, bar]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">{label}</span>
                    <span className="tabular-nums text-zinc-700 dark:text-zinc-200">{pct(value)}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                    <div className={`h-full ${bar}`} style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-xs text-zinc-500 dark:text-zinc-400">
              Uses the game’s current dynamic face values (J/Q/K).
            </div>
          </div>
        ) : (
          <div className="text-sm text-zinc-600 dark:text-zinc-300">No probability available.</div>
        )}
      </Modal>
    </div>
  );
}

