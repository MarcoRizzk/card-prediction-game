# Higher or Lower — Next.js Technical Assessment

A fully functional **Higher or Lower** card game built with **Next.js App Router**. All game rules run **server-side** via API routes and the game persists across refresh using an **encrypted cookie session** (no database).

## Quickstart

1) Install deps

```bash
npm install
```

2) Create `.env.local`

```bash
cp .env.example .env.local
```

Set `SESSION_PASSWORD` to a strong value (**32+ characters**).

3) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Rules implemented

- **Deck**: standard 52 cards, shuffled at start.
- **Round**:
  - A card is shown.
  - Player chooses **Higher** or **Lower**.
  - Next card is drawn and revealed.
- **Scoring**:
  - **Correct** guess → **+1**
  - **Wrong** guess → **+0** (game continues)
- **Card values**:
  - **A** = 1
  - **2–10** = face value
  - **J/Q/K** = dynamic, start at **5**
- **Dynamic face-card values (J/Q/K)**:
  - If a guess **involves** a face card (it is either the **current** or **next** card):
    - Correct guess → that face card value **+1**
    - Wrong guess → that face card value **-1**
  - Values are **clamped to [1..10]**
  - Face values **persist across reshuffles**
- **Equal values edge case (tie)**:
  - If current value == next value → **neutral tie**
  - No score change and **no face-card mutation**
- **Reshuffles**:
  - When the deck runs out, it reshuffles seamlessly.
  - Player chooses the **max reshuffles** before starting: **3 / 5 / 7**
  - When reshuffles are exhausted and another draw is needed → **game finishes** and final score is shown.

## Architecture

- **Pure engine (unit testable)**: `src/lib/game/*`
  - `engine.ts` is the single source of truth for rules (`initGame`, `applyGuess`).
  - Randomness is injectable for deterministic tests.
- **Session**: `src/lib/session/session.ts`
  - Uses `iron-session` and `next/headers` cookies to store `game` state in an encrypted cookie.
- **API routes**: `src/app/api/game/*`
  - `POST /api/game/start` (start with `{ maxReshuffles: 3 | 5 | 7 }`)
  - `GET /api/game/state`
  - `POST /api/game/guess` (body `{ guess: "higher" | "lower" }`)
  - `POST /api/game/reset`
- **UI**: `src/components/*` + `src/app/page.tsx`
  - Client UI calls the API routes and renders state + outcomes.

## Tests

```bash
npm test
```

Tests live in `src/lib/game/engine.test.ts` and cover ties, face-card mutation, clamping, reshuffles, and game finish.

## Trade-offs / notes

- **Cookie size**: storing full game state (deck + metadata) in an encrypted cookie is simple and avoids infrastructure, but it’s larger than storing just an id + server-side state. For an interview scope, the simplicity is worth it.
- **No database**: the game is session-scoped; persistence is only required across refresh within the same session.
