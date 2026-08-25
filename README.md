# VELOOP Rewards — Level-Up Dashboard

A redesigned Level Dashboard for VELOOP Rewards: a premium, fintech-inspired
progression center that combines level tracking, reward reveals, a mini-game,
and earning opportunities into a single hub users have a reason to return to.

> **Status:** Prototype / development build. All XP, reward, and game values
> are dummy data pending approval from the product team. See `src/data/levelConfig.js`.

---

## 1. Project Overview

The original Level Dashboard only showed a level number and an XP count. This
redesign restructures the page around seven questions a user actually has:
where am I, how far have I come, what do I need next, what will I get, what's
the roadmap, what can I do right now, and why should I come back. The result
is a hub, not a stat card: current progress, a locked next-level reward, a
level roadmap, a playable mini-game, and actionable earning cards, all in one
page.

## 2. Level System

- Current level, name, and badge are shown prominently at the top of the page.
- A `LevelRoadmap` component visualizes levels 1 → 7 as a vertical (mobile) or
  horizontal (desktop) track with four states: **completed**, **current**,
  **next**, and **locked** — each with distinct color and iconography.
- Clicking a roadmap node expands a short detail line for that level.

## 3. XP System

- Current XP and required XP are shown as both raw numbers and an animated
  progress bar (`XPProgress`), which fills from 0% on mount using a CSS
  transition.
- XP remaining to the next level is always computed and displayed — the user
  never has to do the subtraction themselves.
- A "Recommended for You" banner dynamically restates the remaining XP.

## 4. Next-Level Rewards

- The `NextLevelReward` card shows the upcoming reward behind a locked-vault
  visual with a lock icon, a glowing reward icon, and a mini progress bar
  toward that unlock — designed to create anticipation without misleading the
  user about what's already earned.
- An info icon explains, in plain language, that the reward reflects the
  *current* reward configuration.

## 5. Game Concept — "VE Coin Catch"

A 20-second skill-based mini-game: coins fall from the top of the play area
and the user taps/clicks to collect them before they reach the bottom. Final
score determines the XP reward tier.

**Why this concept:** it's simple enough to build as a genuine frontend
prototype (no game engine needed), skill-based rather than chance-based (so
it doesn't read as gambling), and it fits the "coins flowing" visual language
used elsewhere in VELOOP's reward system.

### Game Rules

- **Objective:** collect as many falling coins as possible in 20 seconds.
- **Time limit:** 20 seconds per attempt.
- **Attempts:** 3 per day (tracked in `sessionStorage` for this prototype —
  resets on new session; a real implementation would track this server-side
  per user per day).
- **Reward:** XP, tiered by final score (see `GAME_CONFIG.scoreThresholds` in
  `src/data/levelConfig.js`). All values are dummy/demo values.
- **Eligibility:** available to any user viewing the dashboard; no other
  gating in this prototype.

### Game States

`GameContainer` runs a simple state machine: `start → playing → result`, with
"Play Again" looping back to `start` if attempts remain. Score is tracked in
component state (`GamePlay.jsx`), not global state, since it only matters for
the current attempt.

## 6. Earning Features

The `EarnMoreXP` section shows interactive cards for ways to earn XP. Cards
for **Daily Challenge**, **Watch & Earn**, and **Refer & Earn** are treated as
live/implemented concepts. **Streak XP** and **Weekly Quest** are explicitly
marked **Coming Soon** — they are proposed concepts, not implemented
mechanisms, per the "don't imply unapproved features already exist"
requirement.

## 7. Technology Stack

- React 19 + Vite
- Bootstrap (grid utilities only, imported via `bootstrap/dist/css/bootstrap-grid.min.css`)
- CSS Modules for all component styling
- React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`) — no external
  state library, since the data shape doesn't need one
- `lucide-react` for icons
- Fonts: **Sora** (display), **Inter** (body), **IBM Plex Mono** (data/numeric
  values — XP, scores, levels are visually distinguished from copy)

## 8. Installation

```bash
npm install
```

## 9. Development Commands

```bash
npm run dev       # start local dev server
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

## 10. Folder Structure

```
src/
├── components/
│   ├── LevelHero/
│   ├── CurrentLevel/
│   ├── XPProgress/
│   ├── NextLevelReward/
│   ├── LevelRoadmap/
│   ├── PlayAndEarn/
│   │   ├── GameContainer.jsx
│   │   ├── GameStart.jsx
│   │   ├── GamePlay.jsx
│   │   ├── GameResult.jsx
│   │   └── Game.module.css
│   ├── EarnMoreXP/
│   ├── XPActivity/
│   ├── LevelUpModal/
│   └── common/            # Skeleton loading + error state
├── pages/
│   └── LevelDashboard/
├── data/
│   └── levelConfig.js     # single source of truth for dummy data
├── hooks/
│   └── useLevelData.js    # simulated data fetch (loading/success/error)
└── styles/
    └── tokens.css         # design tokens (colors, type, radius, shadow)
```

## 11. Component Architecture

Each component is self-contained (JSX + `.module.css`) and receives data via
props from `LevelDashboard.jsx`, which is the only component that talks to
`useLevelData()`. This means swapping dummy data for a real API only requires
changing `fetchLevelData()` in `useLevelData.js` — no component needs to
change.

## 12. Responsive Behavior

Tested at 320px, 768px, 1280px, 1440px, and 1920px+.

- **Mobile (320px+):** single column, roadmap renders as a vertical track.
- **Tablet (768px+):** earning cards move to a 2-column grid.
- **Laptop+ (1024px+):** `CurrentLevel`/`NextLevelReward` and
  `GameContainer`/`XPActivity` sit side by side; roadmap becomes a horizontal
  scrollable track.
- **Large screens (1440px+):** earning cards move to a 3-column grid; content
  stays capped at a 1240px max-width to avoid over-stretching.

## 13. Animation Details

- XP progress bar fills from 0 on mount (`requestAnimationFrame` + CSS
  transition).
- Falling coins use a linear CSS `@keyframes` animation.
- Level-up modal enters with a scale/fade (`rise` keyframe).
- Result screen reward icon pops in (`pop` keyframe).
- All animation is disabled via `prefers-reduced-motion: reduce` (see
  `tokens.css`).

## 14. States Covered

- **Loading:** shimmer skeleton (`DashboardSkeleton`) matching the real
  layout's shape.
- **Error:** `ErrorState` component with a "Try Again" retry action — no raw
  error/API details shown.
- **Empty:** `XPActivity` renders a dedicated empty state when there's no
  activity yet.
- **Game unavailable:** attempts-exhausted state shows "New challenge coming
  soon."

## 15. Live Demo

https://veloop-dashboard-opal.vercel.app/

## 16. GitHub Repository

https://github.com/Dhanushpugazh/Veloop-level-dashboard/

## 17. Author

Dhanush Pugazhendhi
