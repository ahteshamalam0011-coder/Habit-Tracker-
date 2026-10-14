# Pip Quest — agent notes

TanStack Start + React 19 + Tailwind v4 on Netlify. See `PLAN.md` for remaining milestones.

- `src/routes/index.tsx` — landing page with demo card
- `src/routes/app.tsx` — layout wrapping `GameProvider` + `AppShell`
- `src/routes/app/index.tsx` — Today (check-ins); `src/routes/app/squad.tsx` — leaderboard, head-to-head, feed, invites
- `src/lib/fixtures.ts` — ALL sample data; keep shapes stable when swapping for real queries
- `src/lib/game.tsx` — client game state (XP, levels, streaks); its API is the seam for persistence
- `src/components/` — Pip mascot (served via Netlify Image CDN from `public/img/mascot.png`), Confetti, Modal, HabitCard, AppShell
- `src/styles.css` — theme tokens (`--color-*`, Lilita One/Nunito fonts) and `.chunky`/`.btn` toy-style utilities

Conventions: thick ink borders + hard offset shadows, animate only transform/opacity, respect reduced motion. Browser APIs only in effects/handlers. Use Netlify Identity and Netlify Database for upcoming milestones.
