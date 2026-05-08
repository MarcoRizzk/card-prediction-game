import { GameBoard } from "@/components/GameBoard";

export default function Home() {
  return (
    <div className="min-h-dvh bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <GameBoard />
      </main>
    </div>
  );
}
