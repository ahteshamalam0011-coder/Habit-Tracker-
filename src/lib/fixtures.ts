// All stubbed product data lives here. A later milestone replaces these
// constants with real queries (see PLAN.md) — keep shapes stable.

export type HabitColor = 'tangerine' | 'mint' | 'grape' | 'sky' | 'pink' | 'sun'

export type Habit = {
  id: string
  name: string
  emoji: string
  color: HabitColor
  /** Units required to complete today (1 = simple check-in). */
  target: number
  unit?: string
  /** Units logged today. */
  progress: number
  streak: number
  bestStreak: number
  xp: number
  /** Last 7 days, oldest first, excluding today. */
  week: boolean[]
}

export type Friend = {
  id: string
  name: string
  avatar: string
  color: HabitColor
  level: number
  weeklyXp: number
  totalXp: number
  streak: number
  todayDone: number
  todayTotal: number
  /** Streaks on shared habit categories, for head-to-head. */
  habits: Record<string, number>
  isYou?: boolean
}

export type FeedItem = {
  id: string
  friendId: string
  text: string
  emoji: string
  ago: string
  highFives: number
}

export type Badge = {
  id: string
  name: string
  emoji: string
  description: string
  earned: boolean
}

export const currentUser = {
  name: 'Sam',
  avatar: '🦊',
  level: 7,
  xp: 1340,
  /** XP needed to reach the next level from the current level's floor. */
  levelFloor: 1200,
  levelCeil: 1600,
  coins: 245,
  streak: 12,
  freezes: 2,
}

export const initialHabits: Habit[] = [
  { id: 'workout', name: 'Workout', emoji: '🏋️', color: 'tangerine', target: 1, progress: 0, streak: 12, bestStreak: 18, xp: 30, week: [true, true, true, false, true, true, true] },
  { id: 'read', name: 'Read 20 pages', emoji: '📚', color: 'grape', target: 1, progress: 1, streak: 34, bestStreak: 34, xp: 20, week: [true, true, true, true, true, true, true] },
  { id: 'water', name: 'Hydrate', emoji: '💧', color: 'sky', target: 8, unit: 'glasses', progress: 5, streak: 9, bestStreak: 21, xp: 25, week: [true, false, true, true, true, true, true] },
  { id: 'meditate', name: 'Meditate', emoji: '🧘', color: 'mint', target: 1, progress: 0, streak: 4, bestStreak: 11, xp: 15, week: [false, false, true, false, true, true, true] },
  { id: 'steps', name: '10k steps', emoji: '👟', color: 'pink', target: 10, unit: 'k steps', progress: 6, streak: 2, bestStreak: 15, xp: 25, week: [true, true, false, false, false, true, true] },
]

export const habitTemplates: Omit<Habit, 'id' | 'progress' | 'streak' | 'bestStreak' | 'week'>[] = [
  { name: 'Stretch', emoji: '🤸', color: 'mint', target: 1, xp: 15 },
  { name: 'Journal', emoji: '✍️', color: 'grape', target: 1, xp: 20 },
  { name: 'No sugar', emoji: '🍭', color: 'pink', target: 1, xp: 25 },
  { name: 'Sleep by 11', emoji: '😴', color: 'sky', target: 1, xp: 20 },
  { name: 'Practice guitar', emoji: '🎸', color: 'tangerine', target: 1, xp: 25 },
  { name: 'Eat veggies', emoji: '🥦', color: 'sun', target: 3, unit: 'servings', xp: 20 },
]

export const friends: Friend[] = [
  { id: 'maya', name: 'Maya', avatar: '🐼', color: 'mint', level: 9, weeklyXp: 820, totalXp: 2410, streak: 21, todayDone: 4, todayTotal: 5, habits: { workout: 21, read: 6, water: 14, meditate: 30 } },
  { id: 'you', name: 'You', avatar: currentUser.avatar, color: 'tangerine', level: currentUser.level, weeklyXp: 690, totalXp: currentUser.xp, streak: currentUser.streak, todayDone: 1, todayTotal: 5, habits: { workout: 12, read: 34, water: 9, meditate: 4 }, isYou: true },
  { id: 'leo', name: 'Leo', avatar: '🐸', color: 'sun', level: 6, weeklyXp: 640, totalXp: 1180, streak: 8, todayDone: 3, todayTotal: 4, habits: { workout: 8, read: 2, water: 19, meditate: 0 } },
  { id: 'priya', name: 'Priya', avatar: '🦄', color: 'grape', level: 11, weeklyXp: 590, totalXp: 3320, streak: 47, todayDone: 2, todayTotal: 6, habits: { workout: 47, read: 47, water: 3, meditate: 12 } },
  { id: 'jordan', name: 'Jordan', avatar: '🐙', color: 'pink', level: 4, weeklyXp: 410, totalXp: 720, streak: 3, todayDone: 0, todayTotal: 3, habits: { workout: 3, read: 0, water: 5, meditate: 1 } },
  { id: 'kai', name: 'Kai', avatar: '🐧', color: 'sky', level: 5, weeklyXp: 260, totalXp: 905, streak: 0, todayDone: 1, todayTotal: 4, habits: { workout: 0, read: 11, water: 2, meditate: 5 } },
]

export const feed: FeedItem[] = [
  { id: 'f1', friendId: 'maya', text: 'hit a 30-day Meditate streak', emoji: '🧘', ago: '12m', highFives: 4 },
  { id: 'f2', friendId: 'priya', text: 'leveled up to Level 11', emoji: '⭐', ago: '1h', highFives: 9 },
  { id: 'f3', friendId: 'leo', text: 'drank 8/8 glasses before noon', emoji: '💧', ago: '2h', highFives: 2 },
  { id: 'f4', friendId: 'jordan', text: 'started a new quest: Morning Run', emoji: '🏃', ago: '5h', highFives: 1 },
  { id: 'f5', friendId: 'kai', text: 'used a streak freeze — phew!', emoji: '🧊', ago: '1d', highFives: 3 },
]

export const badges: Badge[] = [
  { id: 'b1', name: 'First Spark', emoji: '✨', description: 'Complete your first check-in', earned: true },
  { id: 'b2', name: 'Week Warrior', emoji: '🛡️', description: '7-day streak on any habit', earned: true },
  { id: 'b3', name: 'Bookworm', emoji: '🐛', description: '30 days of reading', earned: true },
  { id: 'b4', name: 'Perfect Day', emoji: '🌈', description: 'Finish every quest in one day', earned: false },
  { id: 'b5', name: 'Squad Goals', emoji: '🤝', description: 'Invite 3 friends', earned: false },
  { id: 'b6', name: 'Centurion', emoji: '💯', description: '100-day streak', earned: false },
]

export const comparableHabits = [
  { id: 'workout', name: 'Workout', emoji: '🏋️' },
  { id: 'read', name: 'Reading', emoji: '📚' },
  { id: 'water', name: 'Hydration', emoji: '💧' },
  { id: 'meditate', name: 'Meditate', emoji: '🧘' },
]

export const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
