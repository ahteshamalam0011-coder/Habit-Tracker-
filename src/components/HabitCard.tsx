import { useState } from 'react'
import { Check, Plus, RotateCcw } from 'lucide-react'
import type { Habit } from '../lib/fixtures'
import { weekdayLabels } from '../lib/fixtures'
import type { CheckInResult } from '../lib/game'
import { colorBg, isDone, useGame } from '../lib/game'
import { Confetti } from './Confetti'

export function HabitCard({
  habit,
  index,
  onResult,
}: {
  habit: Habit
  index: number
  onResult: (r: CheckInResult, habit: Habit) => void
}) {
  const { checkIn, undo } = useGame()
  const [burst, setBurst] = useState<{ key: number; xp: number; big: boolean } | null>(null)
  const done = isDone(habit)
  const multi = habit.target > 1

  const handleCheck = () => {
    const r = checkIn(habit.id)
    if (!r.xp) return
    setBurst({ key: Date.now(), xp: r.xp, big: r.completed })
    onResult(r, habit)
  }

  return (
    <article
      className={`chunky animate-rise relative flex flex-col overflow-visible p-4 transition-colors duration-300 ${done ? colorBg[habit.color] : ''}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start gap-3">
        <span
          key={done ? 'done' : 'todo'}
          className={`grid size-14 shrink-0 place-items-center rounded-2xl border-[3px] border-ink text-3xl ${done ? 'animate-wiggle bg-paper' : colorBg[habit.color]}`}
        >
          {habit.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-xl leading-tight">{habit.name}</h3>
          <p className={`text-sm font-extrabold ${done ? 'text-ink' : 'text-ink/60'}`}>
            {multi ? `${habit.progress}/${habit.target} ${habit.unit}` : done ? 'Done for today!' : 'Tap to check in'}
            <span className="mx-1.5">·</span>+{habit.xp} XP
          </p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border-[3px] border-ink bg-paper px-2 py-1" title={`Best: ${habit.bestStreak} days`}>
          <span className={habit.streak > 0 ? 'animate-flicker text-xl' : 'text-xl grayscale'}>🔥</span>
          <span className="font-display text-lg leading-none tabular-nums">{habit.streak}</span>
        </div>
      </div>

      {multi && (
        <div className="mt-4 flex gap-1" aria-label={`${habit.progress} of ${habit.target} ${habit.unit}`}>
          {Array.from({ length: habit.target }, (_, i) => (
            <span
              key={i}
              className={`h-3.5 flex-1 rounded-full border-2 border-ink transition-colors duration-200 ${i < habit.progress ? (done ? 'bg-paper' : colorBg[habit.color]) : 'bg-ink/5'}`}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex gap-1" aria-label="Last 7 days">
          {habit.week.map((hit, i) => (
            <span key={i} className="flex flex-col items-center gap-0.5">
              <span className={`size-5 rounded-md border-2 border-ink ${hit ? (done ? 'bg-paper' : colorBg[habit.color]) : 'bg-ink/5'}`} />
              <span className="text-[10px] font-black text-ink/50">{weekdayLabels[i]}</span>
            </span>
          ))}
        </div>

        <div className="relative flex items-center gap-2">
          {habit.progress > 0 && (
            <button
              onClick={() => undo(habit.id)}
              className="press rounded-full border-[3px] border-ink bg-paper p-1.5 opacity-70 hover:opacity-100"
              aria-label={`Undo ${habit.name}`}
              title="Undo"
            >
              <RotateCcw size={14} strokeWidth={3} />
            </button>
          )}
          <button
            onClick={handleCheck}
            disabled={done}
            aria-label={done ? `${habit.name} complete` : multi ? `Log one ${habit.unit}` : `Check in ${habit.name}`}
            className={`btn !size-16 !rounded-full !p-0 ${done ? 'bg-paper !cursor-default' : 'bg-sun'}`}
          >
            {done ? (
              <Check key="c" size={32} strokeWidth={4} className="animate-pop" />
            ) : multi ? (
              <Plus size={30} strokeWidth={4} />
            ) : (
              <Check size={30} strokeWidth={4} className="opacity-25" />
            )}
          </button>
          {burst && (
            <span key={burst.key} className="pointer-events-none absolute right-8 top-8">
              {burst.big && <Confetti />}
              <span className="xp-float whitespace-nowrap font-display text-2xl text-grape [-webkit-text-stroke:1.5px_var(--color-ink)]">
                +{burst.xp} XP
              </span>
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
