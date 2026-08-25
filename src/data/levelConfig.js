// ⚠️ DEVELOPMENT / DEMO DATA ONLY
// This shape is designed to be swapped for a live API response without
// touching any component. Replace `fetchLevelData()` in hooks/useLevelData.js
// with a real request once the backend endpoint exists.

export const DUMMY_USER_LEVEL_DATA = {
  currentLevel: 4,
  currentLevelName: "Voyager",
  currentXP: 6420,
  requiredXP: 8000,
  nextLevel: 5,
  nextLevelName: "Pioneer",
  nextLevelReward: {
    type: "VEs",
    amount: 500,
  },
};

// Roadmap: levels below currentLevel = completed, current = current,
// above = locked. Rewards shown are per-level unlock rewards.
export const DUMMY_LEVEL_ROADMAP = [
  { level: 1, name: "Starter", status: "completed", reward: { type: "VEs", amount: 100 } },
  { level: 2, name: "Explorer", status: "completed", reward: { type: "Gems", amount: 5 } },
  { level: 3, name: "Adventurer", status: "completed", reward: { type: "VEs", amount: 250 } },
  { level: 4, name: "Voyager", status: "current", reward: { type: "Gems", amount: 10 } },
  { level: 5, name: "Pioneer", status: "next", reward: { type: "VEs", amount: 500 } },
  { level: 6, name: "Trailblazer", status: "locked", reward: { type: "Spins", amount: 2 } },
  { level: 7, name: "Vanguard", status: "locked", reward: { type: "Gems", amount: 20 } },
];

export const DUMMY_XP_ACTIVITY = [
  { id: 1, amount: 25, source: "Game Challenge", time: "2h ago" },
  { id: 2, amount: 100, source: "Watch & Earn", time: "5h ago" },
  { id: 3, amount: 50, source: "Daily Task", time: "Yesterday" },
  { id: 4, amount: 20, source: "Referral", time: "2 days ago" },
];

// Earning features. `status: "live"` cards are functional/navigable.
// `status: "coming_soon"` cards are concepts only — clearly labelled per
// spec section 23/47, not implying an unbuilt mechanism already exists.
export const DUMMY_EARNING_FEATURES = [
  {
    id: "daily-challenge",
    title: "Daily Challenge",
    xpLabel: "+50 XP",
    description: "Complete today's mission",
    status: "live",
  },
  {
    id: "watch-earn",
    title: "Watch & Earn",
    xpLabel: "+15 XP",
    description: "Watch an eligible video",
    status: "live",
  },
  {
    id: "refer-earn",
    title: "Refer & Earn",
    xpLabel: "+100 XP",
    description: "Invite a friend to VELOOP",
    status: "live",
  },
  {
    id: "streak-xp",
    title: "Streak XP",
    xpLabel: "+10 XP / day",
    description: "Maintain your daily streak",
    status: "coming_soon",
  },
  {
    id: "weekly-quest",
    title: "Weekly Quest",
    xpLabel: "+200 XP",
    description: "Complete a weekly objective",
    status: "coming_soon",
  },
];

// Mini-game configuration — kept separate so reward values are one
// visible source of truth (spec section 6: dummy values until approved).
export const GAME_CONFIG = {
  name: "VE Coin Catch",
  durationSeconds: 20,
  maxAttemptsPerDay: 3,
  scoreThresholds: [
    { minScore: 0, reward: { type: "XP", amount: 10 } },
    { minScore: 8, reward: { type: "XP", amount: 20 } },
    { minScore: 15, reward: { type: "XP", amount: 35 } },
  ],
  rules: [
    "Coins fall from the top of the play area for 20 seconds.",
    "Tap or click a coin before it reaches the bottom to collect it.",
    `You get ${3} attempts per day.`,
    "Your final score determines your XP reward.",
  ],
};
