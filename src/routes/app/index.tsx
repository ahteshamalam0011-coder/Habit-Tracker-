import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, Lock, Plus, Snowflake } from 'lucide-react'
import type { Habit } from '../../lib/fixtures'
import { badges, currentUser, friends, habitTemplates } from '../../lib/fixtures'
import type { CheckInResult } from '../../lib/game'
import { PERFECT_DAY_BONUS, colorBg, useGame } from '../../lib/game'
import { HabitCard } from '../../components/HabitCard'
import { Confetti } from '../../components/Confetti'
import { Modal } from '../../components/Modal'
import { Pip } from '../../components/Pip'

export const Route = createFileRoute('/app/')({
  head: () => ({ meta: [{ title: "Today's quests · Pip Quest" }] }),
  component: Today,
})

const cheers = ['Nice one!', 'Boom! 💥', 'Streak saved!', 'You’re on fire!', 'Keep it rolling!', 'Legendary!']

type Celebration = { kind: 'perfect' | 'level'; key: number }

function Today() {
  const { habits, doneCount, perfectDay, level, levelProgress, xp } = useGame()
  const [toast, setToast] = useState<{ text: string; key: number } | null>(null)
  const [celebration, setCelebration] = useState<Celebration | null>(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(t)
  }, [toast])

  const onResult = (r: CheckInResult, habit: Habit) => {
    if (!r.completed) return
    const allDone = habits.every((h) => h.id === habit.id || h.progress >= h.target)
    if (allDone) setCelebration({ kind: 'perfect', key: Date.now() })
    else if (r.leveledUp) setCelebration({ kind: 'level', key: Date.now() })
    else setToast({ text: `${habit.emoji} ${cheers[Math.floor(Math.random() * cheers.length)]}`, key: Date.now() })
  }

  const pct = habits.length ? doneCount / habits.length : 0
  const remaining = habits.length - doneCount

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0">
        {/* Daily hero */}
        <div className="chunky relative mb-6 flex items-center gap-4 overflow-hidden bg-sun p-5 sm:p-6">
          <ProgressRing pct={pct} label={`${doneCount}/${habits.length}`} />
          <div className="min-w-0 flex-1">
            <p suppressHydrationWarning className="text-xs font-extrabold uppercase tracking-widest text-ink/60">{dateLabel()}</p>
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">
              {perfectDay ? 'Perfect day! 🌈' : `Hey ${currentUser.name}, ${remaining} quest${remaining === 1 ? '' : 's'} to go`}
            </h1>
            <p className="mt-1 font-bold text-ink/70">
              {perfectDay
                ? `You earned the +${PERFECT_DAY_BONUS} XP perfect-day bonus. Pip is proud.`
                : `Finish them all for a +${PERFECT_DAY_BONUS} XP perfect-day bonus.`}
            </p>
          </div>
          <Pip size={120} className="-mb-8 -mr-4 hidden shrink-0 animate-float sm:block" />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl">Today’s quests</h2>
          <button onClick={() => setAdding(true)} className="btn bg-mint !py-2 !text-base">
            <Plus size={18} strokeWidth={3.5} /> New quest
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {habits.map((h, i) => (
            <HabitCard key={h.id} habit={h} index={i} onResult={onResult} />
          ))}
        </div>
      </section>

      <aside className="flex flex-col gap-6">
        {/* Level card */}
        <div className="chunky bg-grape p-5 text-white">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl">Level {level}</span>
            <span className="font-black tabular-nums">{xp.toLocaleString()} XP</span>
          </div>
          <div className="mt-3 h-5 overflow-hidden rounded-full border-[3px] border-ink bg-white">
            <div className="h-full rounded-full bg-sun transition-[width] duration-700" style={{ width: `${levelProgress * 100}%` }} />
          </div>
          <p className="mt-2 text-sm font-bold text-white/80">
            {Math.round((1 - levelProgress) * 400)} XP to Level {level + 1}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-sky px-3 py-2 text-ink">
            <Snowflake size={18} strokeWidth={3} />
            <span className="text-sm font-extrabold">{currentUser.freezes} streak freezes ready</span>
          </div>
        </div>

        {/* Squad peek */}
        <div className="chunky p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Squad league</h2>
            <Link to="/app/squad" className="flex items-center gap-1 text-sm font-black text-grape hover:underline">
              See all <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>
          <ol className="flex flex-col gap-2">
            {friends.slice(0, 4).map((f, i) => (
              <li
                key={f.id}
                className={`flex items-center gap-3 rounded-2xl border-[3px] px-3 py-2 ${f.isYou ? 'border-ink bg-sun' : 'border-transparent'}`}
              >
                <span className="w-5 font-display text-lg">{i + 1}</span>
                <span className={`grid size-9 place-items-center rounded-full border-[3px] border-ink text-lg ${colorBg[f.color]}`}>{f.avatar}</span>
                <span className="flex-1 font-extrabold">{f.name}</span>
                <span className="font-black tabular-nums">{f.weeklyXp}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Badges */}
        <div className="chunky p-5">
          <h2 className="mb-3 font-display text-xl">Trophy shelf</h2>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => (
              <div key={b.id} className="group flex flex-col items-center text-center" title={b.description}>
                <span
                  className={`relative grid size-14 place-items-center rounded-2xl border-[3px] border-ink text-2xl transition-transform group-hover:-rotate-6 group-hover:scale-110 ${
                    b.earned || (b.id === 'b4' && perfectDay) ? 'bg-sun' : 'bg-ink/5 grayscale opacity-60'
                  }`}
                >
                  {b.emoji}
                  {!(b.earned || (b.id === 'b4' && perfectDay)) && (
                    <Lock size={14} strokeWidth={3} className="absolute -bottom-1.5 -right-1.5 rounded-full border-2 border-ink bg-paper p-0.5" />
                  )}
                </span>
                <span className="mt-1.5 text-xs font-black leading-tight">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {toast && (
        <div key={toast.key} className="chunky-sm animate-pop fixed bottom-28 left-1/2 z-50 -translate-x-1/2 bg-mint px-5 py-3 font-display text-xl sm:bottom-8">
          {toast.text}
        </div>
      )}

      <Modal open={!!celebration} onClose={() => setCelebration(null)} title={celebration?.kind === 'perfect' ? 'Perfect day!' : 'Level up!'}>
        <div className="relative flex flex-col items-center text-center">
          <span key={celebration?.key} className="absolute left-1/2 top-16">
            <Confetti count={30} spread={200} />
          </span>
          <Pip size={150} className="animate-float" />
          <p className="mt-2 font-display text-3xl">
            {celebration?.kind === 'perfect' ? 'Every quest cleared!' : `You reached Level ${level}`}
          </p>
          <p className="mt-1 font-bold text-ink/70">
            {celebration?.kind === 'perfect'
              ? `+${PERFECT_DAY_BONUS} bonus XP and the 🌈 Perfect Day badge are yours.`
              : 'New avatar frames unlocked in the shop.'}
          </p>
          <button onClick={() => setCelebration(null)} className="btn mt-5 w-full bg-sun">
            Woohoo!
          </button>
        </div>
      </Modal>

      <AddQuestModal open={adding} onClose={() => setAdding(false)} />
    </div>
  )
}

function AddQuestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addHabit, habits } = useGame()
  return (
    <Modal open={open} onClose={onClose} title="Pick a new quest">
      <div className="grid grid-cols-2 gap-3">
        {habitTemplates.map((t, i) => {
          const taken = habits.some((h) => h.name === t.name)
          return (
            <button
              key={t.name}
              disabled={taken}
              onClick={() => {
                addHabit(i)
                onClose()
              }}
              className={`chunky-sm press flex flex-col items-start gap-1 p-3 text-left ${taken ? 'opacity-40' : `${colorBg[t.color]} hover:-rotate-1`}`}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="font-display text-lg leading-tight">{t.name}</span>
              <span className="text-xs font-black">
                {t.target > 1 ? `${t.target} ${t.unit} · ` : ''}+{t.xp} XP
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-ink/60">Custom quests with your own goals are coming soon.</p>
    </Modal>
  )
}

function ProgressRing({ pct, label }: { pct: number; label: string }) {
  const r = 38
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid size-24 shrink-0 place-items-center sm:size-28">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="14" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-paper)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-tangerine)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.3,1.4,.5,1)' }}
        />
      </svg>
      <span className="relative font-display text-2xl sm:text-3xl">{label}</span>
    </div>
  )
}

function dateLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
