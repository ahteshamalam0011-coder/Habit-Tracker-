const COLORS = ['#ff7a1a', '#ffc83d', '#2fd3a1', '#8b5cf6', '#3bb4ff', '#ff5da2']

/** A one-shot burst of confetti. Re-mount (change `key`) to fire again. */
export function Confetti({ count = 18, spread = 120 }: { count?: number; spread?: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.3
        const dist = spread * (0.55 + ((i * 37) % 45) / 100)
        const style = {
          '--dx': `${Math.cos(angle) * dist}px`,
          '--dy': `${Math.sin(angle) * dist}px`,
          '--rot': `${(i % 2 ? 1 : -1) * (180 + i * 40)}deg`,
          background: COLORS[i % COLORS.length],
          width: i % 3 === 0 ? 8 : 10,
          height: i % 3 === 0 ? 14 : 10,
          borderRadius: i % 2 ? 999 : 2,
          animationDelay: `${(i % 4) * 25}ms`,
        } as React.CSSProperties
        return <span key={i} className="confetti-bit border-2 border-ink" style={style} />
      })}
    </span>
  )
}
