import {useState} from 'react'
import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router'
import {ExternalLinkIcon, InfoIcon, ShieldCheckIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {EmptyShell} from '@/layout/shell/empty-shell'
import {backlog} from '@/backlog/backlog'

export const Route = createFileRoute('/on-boarding/')({
  beforeLoad: () => {
    if (backlog.isConnected()) {
      throw redirect({to: '/dashboard'})
    }
  },
  component: OnboardingPage,
})

function OnboardingPage() {
  const navigate = useNavigate()
  const [spaceUrl, setSpaceUrl] = useState('https://dattjapan.backlog.com')

  function connect() {
    if (!spaceUrl.trim()) return

    backlog.connectWithOAuth(spaceUrl, 'mock-access-token')
    void navigate({to: '/dashboard'})
  }

  return (
    <EmptyShell>
      <section className="w-full max-w-lg rounded-xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        <div className="mb-6 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheckIcon className="size-5" />
        </div>
        <p className="text-sm font-medium text-primary">Welcome to DATT</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Connect your Backlog workspace</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose how this app should authenticate with Backlog.</p>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-medium" htmlFor="backlog-space-url">Backlog space URL</label>
          <Input
            id="backlog-space-url"
            className="h-10"
            type="url"
            value={spaceUrl}
            onChange={(event) => setSpaceUrl(event.target.value)}
            placeholder="https://your-space.backlog.com"
          />
          <p className="text-xs text-muted-foreground">Use the full URL for the workspace you want to connect.</p>
        </div>

        <div className="my-6 grid grid-cols-2 rounded-lg bg-muted p-1">
          <Button variant="secondary">OAuth</Button>
          <Button variant="ghost">API key</Button>
        </div>

        <div className="space-y-5">
          <div className="flex gap-3 rounded-lg border bg-muted/40 p-4">
            <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Connect securely with Backlog OAuth</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your browser will open for approval, then return the result to this app automatically.
              </p>
            </div>
          </div>

          <Button className="h-9 px-4" disabled={!spaceUrl.trim()} onClick={connect}>
            <ExternalLinkIcon />
            Connect with Backlog
          </Button>
        </div>

        <div className="mt-6 flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="leading-5">You can reconnect or change authentication method anytime from <span className="font-medium">Settings → Backlog</span>.</p>
        </div>
      </section>
    </EmptyShell>
  )
}
