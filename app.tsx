import { Outlet, createFileRoute } from '@tanstack/react-router'
import { GameProvider } from '../lib/game'
import { AppShell } from '../components/AppShell'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <GameProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </GameProvider>
  )
}
