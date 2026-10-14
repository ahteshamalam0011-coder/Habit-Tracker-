import { Link } from '@tanstack/react-router'
import { Swords, Sun, Users } from 'lucide-react'
import { useGame } from '../lib/game'
import { currentUser } from '../lib/fixtures'
import { Pip } from './Pip'

const tabs = [
  { to: '/app', label: 'Today', icon: Sun },
  { to: '/app/squad', label: 'Squad', icon: Users },
] as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const { xp, level, levelProgress, coins } = useGame()
  return (
    <div className="min-h-screen pb-28 sm:pb-12">
      <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Link to="/" className="flex items-center gap-1.5">
            <Pip size={40} />
            <span className="font-display text-2xl leading-none">Pip Quest</span>
          </Link>
          <nav className="ml-6 hidden gap-2 sm:flex">
            {tabs.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: true }}
                className="press flex items-center gap-2 rounded-xl border-[3px] border-transparent px-3 py-1.5 font-extrabold hover:border-ink"
                activeProps={{ className: '!border-ink bg-sun' }}
              >
                <t.icon size={18} strokeWidth={2.75} /> {t.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="chunky-sm hidden items-center gap-1.5 bg-paper px-3 py-1 font-black md:flex" title="Day streak">
              <span className="animate-flicker">🔥</span> {currentUser.streak}
            </div>
            <div className="chunky-sm flex items-center gap-1.5 bg-paper px-3 py-1 font-black" title="Coins">
              🪙 <span className="tabular-nums">{coins}</span>
            </div>
            <div className="chunky-sm flex items-center gap-2 bg-grape px-2.5 py-1 text-white" title={`${xp} XP total`}>
              <Swords size={16} strokeWidth={3} />
              <span className="font-display text-lg leading-none">Lv {level}</span>
              <span className="hidden h-2.5 w-16 overflow-hidden rounded-full border-2 border-ink bg-white sm:block">
                <span className="block h-full bg-sun transition-[width] duration-500" style={{ width: `${levelProgress * 100}%` }} />
              </span>
            </div>
            <span className="grid size-10 place-items-center rounded-full border-[3px] border-ink bg-tangerine text-xl" aria-label={currentUser.name}>
              {currentUser.avatar}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6">{children}</main>

      <nav className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
        <div className="chunky flex justify-around p-2">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: true }}
              className="press flex flex-1 flex-col items-center rounded-2xl py-1.5 text-sm font-black"
              activeProps={{ className: 'bg-sun' }}
            >
              <t.icon size={22} strokeWidth={2.75} />
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
