import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Habit } from './fixtures'
import { currentUser, habitTemplates, initialHabits } from './fixtures'

// Client-side game state seeded from fixtures. Milestone 3 (PLAN.md) moves
// check-ins to the database; the provider API is the seam to swap.

export const LEVEL_SIZE = 400
export const PERFECT_DAY_BONUS = 50

export type CheckInResult = { completed: boolean; xp: number; leveledUp: boolean }

type GameState = {
  habits: Habit[]
  xp: number
  level: number
  levelProgress: number
  coins: number
  doneCount: number
  perfectDay: boolean
  checkIn: (id: string) => CheckInResult
  undo: (id: string) => void
  addHabit: (templateIndex: number) => void
}

const GameContext = createContext<GameState | null>(null)

export const isDone = (h: Habit) => h.progress >= h.target

function levelFor(xp: number) {
  const floor = currentUser.levelFloor - (currentUser.level - 1) * LEVEL_SIZE
  return Math.max(1, Math.floor((xp - floor) / LEVEL_SIZE) + 1)
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState(initialHabits)
  const [xp, setXp] = useState(currentUser.xp)
  const [coins, setCoins] = useState(currentUser.coins)

  const doneCount = habits.filter(isDone).length
  const perfectDay = habits.length > 0 && doneCount === habits.length
  const level = levelFor(xp)
  const floor = currentUser.levelFloor + (level - currentUser.level) * LEVEL_SIZE
  const levelProgress = Math.min(1, Math.max(0, (xp - floor) / LEVEL_SIZE))

  const checkIn = useCallback(
    (id: string): CheckInResult => {
      const habit = habits.find((h) => h.id === id)
      if (!habit || isDone(habit)) return { completed: false, xp: 0, leveledUp: false }
      const completed = habit.progress + 1 >= habit.target
      const othersDone = habits.filter((h) => h.id !== id && isDone(h)).length
      const finishesDay = completed && othersDone === habits.length - 1
      const gained = completed ? habit.xp + (finishesDay ? PERFECT_DAY_BONUS : 0) : 2
      setHabits((hs) =>
        hs.map((h) =>
          h.id === id
            ? {
                ...h,
                progress: h.progress + 1,
                streak: completed ? h.streak + 1 : h.streak,
                bestStreak: completed ? Math.max(h.bestStreak, h.streak + 1) : h.bestStreak,
              }
            : h,
        ),
      )
      setXp((x) => x + gained)
      if (completed) setCoins((c) => c + 5)
      return { completed, xp: gained, leveledUp: levelFor(xp + gained) > levelFor(xp) }
    },
    [habits, xp],
  )

  const undo = useCallback(
    (id: string) => {
      const habit = habits.find((h) => h.id === id)
      if (!habit || habit.progress === 0) return
      const wasDone = isDone(habit)
      const wasPerfect = wasDone && habits.every(isDone)
      setHabits((hs) =>
        hs.map((h) =>
          h.id === id
            ? { ...h, progress: h.progress - 1, streak: wasDone ? h.streak - 1 : h.streak }
            : h,
        ),
      )
      const lost = wasDone ? habit.xp + (wasPerfect ? PERFECT_DAY_BONUS : 0) : 2
      setXp((x) => x - lost)
      if (wasDone) setCoins((c) => c - 5)
    },
    [habits],
  )

  const addHabit = useCallback((templateIndex: number) => {
    const t = habitTemplates[templateIndex]
    setHabits((hs) => [
      ...hs,
      { ...t, id: `${t.name}-${Date.now()}`, progress: 0, streak: 0, bestStreak: 0, week: Array(7).fill(false) },
    ])
  }, [])

  const value = useMemo(
    () => ({ habits, xp, level, levelProgress, coins, doneCount, perfectDay, checkIn, undo, addHabit }),
    [habits, xp, level, levelProgress, coins, doneCount, perfectDay, checkIn, undo, addHabit],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}

export const colorBg: Record<Habit['color'], string> = {
  tangerine: 'bg-tangerine',
  mint: 'bg-mint',
  grape: 'bg-grape',
  sky: 'bg-sky',
  pink: 'bg-pink',
  sun: 'bg-sun',
}
export const colorText: Record<Habit['color'], string> = {
  tangerine: 'text-tangerine',
  mint: 'text-mint',
  grape: 'text-grape',
  sky: 'text-sky',
  pink: 'text-pink',
  sun: 'text-sun',
}
