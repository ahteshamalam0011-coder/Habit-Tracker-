import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Check, Copy, Crown, Hand, Mail, UserPlus } from 'lucide-react'
import type { Friend } from '../../lib/fixtures'
import { comparableHabits, currentUser, feed, friends } from '../../lib/fixtures'
import { colorBg, useGame } from '../../lib/game'
import { Modal } from '../../components/Modal'
import { Confetti } from '../../components/Confetti'

export const Route = createFileRoute('/app/squad')({
  head: () => ({ meta: [{ title: 'Squad · Pip Quest' }] }),
  component: Squad,
})

type Board = 'week' | 'streak'

function Squad() {
  const { xp, habits } = useGame()
  const [board, setBoard] = useState<Board>('week')
  const [rivalId, setRivalId] = useState('maya')
  const [inviteOpen, setInviteOpen] = useState(false)

  // Fold today's live check-ins into the "You" row.
  const squad = useMemo(() => {
    const live = habits.reduce<Record<string, number>>((acc, h) => ({ ...acc, [h.id]: h.streak }), {})
    return friends.map((f) =>
      f.isYou
        ? { ...f, weeklyXp: f.weeklyXp + (xp - currentUser.xp), habits: { ...f.habits, ...live } }
        : f,
    )
  }, [xp, habits])

  const ranked = [...squad].sort((a, b) => (board === 'week' ? b.weeklyXp - a.weeklyXp : b.streak - a.streak))
  const score = (f: Friend) => (board === 'week' ? `${f.weeklyXp} XP` : `${f.streak} 🔥`)
  const you = squad.find((f) => f.isYou)!
  const rival = squad.find((f) => f.id === rivalId)!
  const yourRank = ranked.findIndex((f) => f.isYou) + 1

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-ink/60">Weekly league · resets in 3 days</p>
          <h1 className="font-display text-4xl">Your squad</h1>
          <p className="font-bold text-ink/70">
            You’re <span className="rounded-lg bg-sun px-1.5 font-black">#{yourRank}</span> of {squad.length}. {yourRank > 1 ? 'Check in to climb!' : 'Defend that crown!'}
          </p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="btn bg-pink text-ink">
          <UserPlus size={20} strokeWidth={3} /> Invite friends
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Leaderboard */}
        <section className="chunky p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Leaderboard</h2>
            <div role="tablist" className="flex rounded-2xl border-[3px] border-ink bg-ink/5 p-1">
              {(['week', 'streak'] as const).map((b) => (
                <button
                  key={b}
                  role="tab"
                  aria-selected={board === b}
                  onClick={() => setBoard(b)}
                  className={`press rounded-xl px-3 py-1 text-sm font-black ${board === b ? 'bg-sun shadow-[2px_2px_0_0_var(--color-ink)] border-2 border-ink' : 'border-2 border-transparent'}`}
                >
                  {b === 'week' ? 'This week' : 'Streaks'}
                </button>
              ))}
            </div>
          </div>

          <Podium top={ranked.slice(0, 3)} score={score} />

          <ol className="mt-5 flex flex-col gap-2">
            {ranked.slice(3).map((f, i) => (
              <li
                key={f.id}
                className={`animate-rise flex items-center gap-3 rounded-2xl border-[3px] px-3 py-2.5 ${f.isYou ? 'border-ink bg-sun' : 'border-ink/10 bg-paper'}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="w-6 font-display text-xl">{i + 4}</span>
                <Avatar f={f} size="size-10 text-xl" />
                <div className="flex-1">
                  <p className="font-extrabold leading-tight">{f.name}</p>
                  <p className="text-xs font-bold text-ink/60">Lv {f.level} · {f.todayDone}/{f.todayTotal} today</p>
                </div>
                <span className="font-black tabular-nums">{score(f)}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Head to head */}
        <section className="chunky p-5">
          <h2 className="font-display text-2xl">Head to head</h2>
          <p className="mb-4 text-sm font-bold text-ink/60">Compare streaks on the habits you share.</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {squad.filter((f) => !f.isYou).map((f) => (
              <button
                key={f.id}
                onClick={() => setRivalId(f.id)}
                className={`press flex items-center gap-1.5 rounded-full border-[3px] border-ink py-1 pl-1 pr-3 text-sm font-black ${rivalId === f.id ? colorBg[f.color] : 'bg-paper'}`}
              >
                <span className="text-lg">{f.avatar}</span> {f.name}
              </button>
            ))}
          </div>

          <div className="mb-3 flex items-center justify-between font-display text-lg">
            <span className="flex items-center gap-2"><Avatar f={you} size="size-8 text-base" /> You</span>
            <span className="flex items-center gap-2">{rival.name} <Avatar f={rival} size="size-8 text-base" /></span>
          </div>
          <div className="flex flex-col gap-3">
            {comparableHabits.map((h) => {
              const a = you.habits[h.id] ?? 0
              const b = rival.habits[h.id] ?? 0
              const max = Math.max(a, b, 1)
              return (
                <div key={h.id}>
                  <p className="mb-1 text-center text-xs font-black uppercase tracking-wider text-ink/60">
                    {h.emoji} {h.name}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Bar value={a} pct={a / max} win={a >= b} color="bg-tangerine" align="right" />
                    <Bar value={b} pct={b / max} win={b > a} color={colorBg[rival.color]} align="left" />
                  </div>
                </div>
              )
            })}
          </div>
          <Verdict you={you} rival={rival} />
        </section>
      </div>

      <FeedSection onInvite={() => setInviteOpen(true)} />
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}

function Avatar({ f, size }: { f: Friend; size: string }) {
  return <span className={`grid shrink-0 place-items-center rounded-full border-[3px] border-ink ${colorBg[f.color]} ${size}`}>{f.avatar}</span>
}

function Podium({ top, score }: { top: Friend[]; score: (f: Friend) => string }) {
  const order = [1, 0, 2] // silver, gold, bronze
  const heights = ['h-28', 'h-20', 'h-14']
  const medals = ['bg-sun', 'bg-[#d9dde8]', 'bg-[#f0a46b]']
  return (
    <div className="grid grid-cols-3 items-end gap-3">
      {order.map((rank) => {
        const f = top[rank]
        if (!f) return <div key={rank} />
        return (
          <div key={f.id} className="flex flex-col items-center animate-pop" style={{ animationDelay: `${(2 - rank) * 120}ms` }}>
            {rank === 0 && <Crown className="mb-1 animate-flicker text-sun" fill="currentColor" stroke="var(--color-ink)" strokeWidth={2.5} size={30} />}
            <Avatar f={f} size={rank === 0 ? 'size-16 text-3xl' : 'size-12 text-2xl'} />
            <p className="mt-1 font-extrabold leading-tight">{f.isYou ? 'You' : f.name}</p>
            <p className="text-sm font-black tabular-nums text-ink/70">{score(f)}</p>
            <div className={`mt-2 grid w-full place-items-center rounded-t-2xl border-[3px] border-b-0 border-ink font-display text-3xl ${medals[rank]} ${heights[rank]} ${f.isYou ? 'ring-4 ring-tangerine ring-offset-2 ring-offset-paper' : ''}`}>
              {rank + 1}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Bar({ value, pct, win, color, align }: { value: number; pct: number; win: boolean; color: string; align: 'left' | 'right' }) {
  return (
    <div className={`flex h-8 items-center rounded-xl border-[3px] border-ink bg-ink/5 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex h-full items-center rounded-lg px-2 font-black transition-[width] duration-500 ${color} ${align === 'right' ? 'justify-start' : 'justify-end'}`}
        style={{ width: `max(2.5rem, ${pct * 100}%)` }}
      >
        <span className="text-sm tabular-nums">{value}{win && value > 0 ? ' 👑' : ''}</span>
      </div>
    </div>
  )
}

function Verdict({ you, rival }: { you: Friend; rival: Friend }) {
  const wins = comparableHabits.filter((h) => (you.habits[h.id] ?? 0) >= (rival.habits[h.id] ?? 0)).length
  const msg =
    wins > comparableHabits.length / 2
      ? `You lead ${wins}–${comparableHabits.length - wins}. Rub it in (nicely).`
      : wins === comparableHabits.length / 2
        ? `Dead even at ${wins}–${wins}. Tiebreaker today?`
        : `${rival.name} leads ${comparableHabits.length - wins}–${wins}. Time for a comeback!`
  return <p className="mt-5 rounded-2xl border-[3px] border-dashed border-ink/30 px-3 py-2 text-center font-extrabold">{msg}</p>
}

function FeedSection({ onInvite }: { onInvite: () => void }) {
  const [fived, setFived] = useState<Record<string, number>>({})
  return (
    <section className="chunky p-5">
      <h2 className="mb-4 font-display text-2xl">Squad activity</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {feed.map((item) => {
          const f = friends.find((x) => x.id === item.friendId)!
          const mine = fived[item.id]
          return (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl border-[3px] border-ink/10 bg-paper p-3">
              <Avatar f={f} size="size-11 text-xl" />
              <p className="flex-1 text-sm font-bold leading-snug">
                <span className="font-black">{f.name}</span> {item.text} {item.emoji}
                <span className="block text-xs text-ink/50">{item.ago} ago</span>
              </p>
              <button
                onClick={() => setFived((s) => ({ ...s, [item.id]: mine ? 0 : Date.now() }))}
                aria-pressed={!!mine}
                className={`press relative flex items-center gap-1 rounded-full border-[3px] border-ink px-2.5 py-1 text-sm font-black ${mine ? 'bg-sun' : 'bg-paper hover:bg-sun/40'}`}
              >
                {!!mine && <span key={mine} className="absolute left-1/2 top-1/2"><Confetti count={10} spread={45} /></span>}
                <Hand size={15} strokeWidth={3} className={mine ? 'animate-wiggle' : ''} /> {item.highFives + (mine ? 1 : 0)}
              </button>
            </li>
          )
        })}
        <li>
          <button onClick={onInvite} className="press flex h-full w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-dashed border-ink/40 p-3 font-black text-ink/60 hover:border-ink hover:text-ink">
            <UserPlus size={18} strokeWidth={3} /> More friends = more fun
          </button>
        </li>
      </ul>
    </section>
  )
}

function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const link = 'pipquest.app/join/sam-7FX2'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${link}`)
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('That email looks a little off.')
    if (sent.includes(email)) return setError('Already invited!')
    setSent((s) => [...s, email])
    setEmail('')
    setError('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Grow your squad">
      <p className="mb-4 font-bold text-ink/70">Friends who join get a free streak freeze. You get 🪙 50 when they finish their first quest.</p>

      <div className="mb-5 flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-cream p-2 pl-3">
        <span className="flex-1 truncate font-mono text-sm font-bold">{link}</span>
        <button onClick={copy} className={`btn !px-3 !py-1.5 !text-base ${copied ? 'bg-mint' : 'bg-sun'}`}>
          {copied ? <Check size={16} strokeWidth={3.5} /> : <Copy size={16} strokeWidth={3} />} {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <form onSubmit={send} noValidate>
        <label htmlFor="invite-email" className="mb-1.5 block text-sm font-black">Or invite by email</label>
        <div className="flex gap-2">
          <input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="buddy@example.com"
            aria-invalid={!!error}
            className={`min-w-0 flex-1 rounded-2xl border-[3px] bg-paper px-3 py-2 font-bold outline-none focus:ring-4 focus:ring-grape/30 ${error ? 'border-pink' : 'border-ink'}`}
          />
          <button type="submit" className="btn bg-grape !px-4 !py-2 text-white">
            <Mail size={18} strokeWidth={3} />
          </button>
        </div>
        {error && <p className="mt-1.5 text-sm font-black text-pink">{error}</p>}
      </form>

      {sent.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5">
          {sent.map((s) => (
            <li key={s} className="animate-pop flex items-center justify-between rounded-xl bg-mint/25 px-3 py-1.5 text-sm font-bold">
              {s} <span className="text-xs font-black uppercase text-ink/60">Invite sent ✉️</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-center text-xs font-black uppercase tracking-wider text-ink/50">
        🤝 Squad Goals badge: {Math.min(sent.length, 3)}/3 invites
      </p>
    </Modal>
  )
}
