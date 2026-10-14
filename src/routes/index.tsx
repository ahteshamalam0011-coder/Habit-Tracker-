import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, Check, Flame, Trophy, Users } from 'lucide-react'
import { Pip } from '../components/Pip'
import { Confetti } from '../components/Confetti'

export const Route = createFileRoute('/')({
  component: Landing,
})

const demoQuests = [
  { id: 'run', emoji: '🏃', name: 'Morning run', color: 'bg-tangerine', xp: 30 },
  { id: 'read', emoji: '📚', name: 'Read 20 pages', color: 'bg-grape', xp: 20 },
  { id: 'water', emoji: '💧', name: '8 glasses of water', color: 'bg-sky', xp: 25 },
]

const ticker = ['🏋️ Workouts', '📚 Reading', '💧 Hydration', '🧘 Meditation', '👟 Steps', '✍️ Journaling', '😴 Sleep', '🥦 Veggies']

function Landing() {
  return (
    <div className="overflow-x-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="flex items-center gap-1.5">
          <Pip size={44} />
          <span className="font-display text-2xl">Pip Quest</span>
        </span>
        <Link to="/app" className="btn bg-paper !py-2 !text-base">
          Open app
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 lg:grid-cols-[1.1fr_1fr] lg:pt-12">
        <div className="animate-rise">
          <span className="chunky-sm inline-flex items-center gap-2 bg-mint px-3 py-1 text-sm font-black">
            <Flame size={16} strokeWidth={3} /> Your streak starts today
          </span>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:text-7xl">
            Habits that feel like{' '}
            <span className="relative inline-block -rotate-2 rounded-2xl border-[3px] border-ink bg-sun px-3 shadow-[5px_5px_0_0_var(--color-ink)]">
              a game
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg font-bold text-ink/70">
            Check in on workouts, reading, hydration and anything else you want to stick with. Every tap earns XP, keeps
            your streak flame burning, and climbs you up the weekly league against your friends.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/app" className="btn bg-tangerine !text-xl">
              Start your quest <ArrowRight size={22} strokeWidth={3} />
            </Link>
            <Link to="/app/squad" className="btn bg-paper !text-xl">
              <Users size={22} strokeWidth={3} /> See the squad
            </Link>
          </div>
          <p className="mt-5 text-sm font-extrabold text-ink/50">Free forever for your daily quests. No ads, no guilt trips.</p>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <Pip size={190} className="absolute -right-6 -top-20 z-10 animate-float sm:-right-12" />
          <DemoCard />
          <div className="chunky-sm absolute -bottom-6 -left-4 rotate-[-6deg] bg-pink px-4 py-2 font-display text-lg">
            🔥 34-day streak!
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y-[3px] border-ink bg-ink py-3 text-paper">
        <div className="animate-marquee flex w-max gap-10 font-display text-2xl">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="whitespace-nowrap">
              {t} <span className="text-sun">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center font-display text-4xl sm:text-5xl">Three loops. Zero boredom.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Feature
            color="bg-sun"
            icon={<Check size={30} strokeWidth={4} />}
            title="Check in, get loot"
            body="One satisfying tap per habit. Confetti, XP and coins every single time — plus a bonus when you clear the whole day."
            tilt="md:-rotate-1"
          />
          <Feature
            color="bg-tangerine"
            icon={<Flame size={30} strokeWidth={3} />}
            title="Feed your flame"
            body="Each habit has its own streak. Miss a day? Spend a streak freeze and Pip keeps glowing."
            tilt="md:rotate-1 md:translate-y-4"
          />
          <Feature
            color="bg-grape text-white"
            icon={<Trophy size={30} strokeWidth={3} />}
            title="Race your squad"
            body="Invite friends, climb the weekly league, go head-to-head on shared habits and send high-fives."
            tilt="md:-rotate-1"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="chunky relative flex flex-col items-center gap-6 overflow-hidden bg-mint px-6 py-12 text-center sm:flex-row sm:text-left">
          <Pip size={150} className="shrink-0 animate-float" />
          <div className="flex-1">
            <h2 className="font-display text-4xl">Pip is ready when you are.</h2>
            <p className="mt-2 text-lg font-bold text-ink/70">Pick three habits, check in once, and watch the streak begin.</p>
          </div>
          <Link to="/app" className="btn bg-sun !text-xl">
            Let’s go <ArrowRight size={22} strokeWidth={3} />
          </Link>
        </div>
      </section>

      <footer className="border-t-[3px] border-ink py-6 text-center text-sm font-extrabold text-ink/50">
        Pip Quest · made for tiny daily wins
      </footer>
    </div>
  )
}

function DemoCard() {
  const [done, setDone] = useState<Record<string, number>>({})
  const count = Object.values(done).filter(Boolean).length
  const xp = demoQuests.reduce((sum, q) => sum + (done[q.id] ? q.xp : 0), 0)

  return (
    <div className="chunky rotate-1 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-xl">Try it — tap a quest</p>
        <span className="chunky-sm bg-grape px-2.5 py-0.5 font-display text-white tabular-nums">+{xp} XP</span>
      </div>
      <ul className="flex flex-col gap-3">
        {demoQuests.map((q) => {
          const on = !!done[q.id]
          return (
            <li key={q.id}>
              <button
                onClick={() => setDone((d) => ({ ...d, [q.id]: on ? 0 : Date.now() }))}
                aria-pressed={on}
                className={`press relative flex w-full items-center gap-3 rounded-2xl border-[3px] border-ink p-3 text-left transition-colors ${on ? q.color : 'bg-paper hover:bg-cream'}`}
              >
                <span className="grid size-11 place-items-center rounded-xl border-[3px] border-ink bg-paper text-2xl">{q.emoji}</span>
                <span className="flex-1 font-display text-lg">{q.name}</span>
                <span className={`relative grid size-10 place-items-center rounded-full border-[3px] border-ink ${on ? 'bg-paper' : 'bg-sun'}`}>
                  {on && <Check key={done[q.id]} size={22} strokeWidth={4} className="animate-pop" />}
                  {on && (
                    <span key={`c${done[q.id]}`} className="absolute left-1/2 top-1/2">
                      <Confetti count={14} spread={70} />
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 h-4 overflow-hidden rounded-full border-[3px] border-ink bg-ink/5">
        <div className="h-full bg-tangerine transition-[width] duration-500" style={{ width: `${(count / demoQuests.length) * 100}%` }} />
      </div>
      <p className="mt-2 text-center text-sm font-black text-ink/60">
        {count === demoQuests.length ? '🌈 Perfect day! That’s the feeling.' : `${count}/${demoQuests.length} quests done`}
      </p>
    </div>
  )
}

function Feature({ color, icon, title, body, tilt }: { color: string; icon: React.ReactNode; title: string; body: string; tilt: string }) {
  return (
    <div className={`chunky p-6 transition-transform hover:-translate-y-1 ${tilt}`}>
      <span className={`grid size-14 place-items-center rounded-2xl border-[3px] border-ink ${color}`}>{icon}</span>
      <h3 className="mt-4 font-display text-2xl">{title}</h3>
      <p className="mt-2 font-bold text-ink/70">{body}</p>
    </div>
  )
}
