import { Badge } from "@/components/ui/Badge";
import type { PublicGameStateDto } from "@/lib/dtos";

export function StatsBar({ game }: { game: PublicGameStateDto }) {
  const reshufflesLeft = Math.max(0, game.maxReshuffles - game.reshufflesUsed);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Score {game.score}</Badge>
      <Badge variant="muted">Streak {game.streak}</Badge>
      <Badge variant="muted">
        Reshuffles {game.reshufflesUsed}/{game.maxReshuffles} (left {reshufflesLeft})
      </Badge>
      <Badge variant="muted">Remaining {game.remainingInDeck}</Badge>
      <Badge variant="muted">
        Face J:{game.faceValues.J} Q:{game.faceValues.Q} K:{game.faceValues.K}
      </Badge>
    </div>
  );
}

