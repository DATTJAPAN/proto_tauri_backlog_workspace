import {useCallback, useEffect, useState} from 'react'
import {invoke} from '@tauri-apps/api/core'
import {createFileRoute, useNavigate, useRouter} from '@tanstack/react-router'
import {
  CheckCircle2Icon,
  CircleXIcon,
  KeyRoundIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from 'lucide-react'

import {backlog} from '@/backlog/Backlog'
import {type BacklogAuthMethod, type BacklogConnection} from '@/backlog/BacklogAuthentication'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Separator} from '@/components/ui/separator'
import {SidebarTrigger} from '@/components/ui/sidebar'
import {AppShell} from '@/layout/shell/app-shell'
import {_apiKeyForm} from '@/routes/on-boarding/_component/_api-key-form'
import {_oauthForm} from '@/routes/on-boarding/_component/_oauth-form'

type ConnectionStatus = {
  connected: boolean
  message: string
  space: {spaceKey: string; name: string} | null
}

export const Route = createFileRoute('/auth/')({
  component: AuthenticationPage,
})

function AuthenticationPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [checking, setChecking] = useState(true)
  const [method, setMethod] = useState<BacklogAuthMethod>('oauth')
  const [spaceUrl, setSpaceUrl] = useState('')
  const [disconnecting, setDisconnecting] = useState(false)

  const refreshStatus = useCallback(async () => {
    setChecking(true)

    try {
      const connection = await backlog.getConnection()
      if (!connection) {
        setStatus({connected: false, message: 'Not connected', space: null})
        return
      }

      setMethod(connection.method)
      setSpaceUrl(connection.spaceUrl)
      setStatus(await checkConnection(connection))
    } catch (cause) {
      setStatus({
        connected: false,
        message: cause instanceof Error ? cause.message : String(cause),
        space: null,
      })
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    void refreshStatus()
  }, [refreshStatus])

  async function disconnect() {
    if (disconnecting) return

    setDisconnecting(true)
    try {
      await backlog.disconnect()
      await router.invalidate()
      await navigate({to: '/on-boarding', replace: true})
    } catch (cause) {
      setStatus({
        connected: false,
        message: `Could not disconnect: ${cause instanceof Error ? cause.message : String(cause)}`,
        space: null,
      })
      setDisconnecting(false)
    }
  }

  return (
    <AppShell>
      <header className="sticky top-0 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheckIcon className="size-4 text-muted-foreground" />
          Authentication
        </div>
      </header>

      <main className="w-full max-w-3xl p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Backlog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and verify this app&apos;s connection to your Backlog workspace.
          </p>
        </div>

        <section className="mb-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {status?.connected ? (
                <CheckCircle2Icon className="mt-0.5 size-5 text-primary" />
              ) : (
                <CircleXIcon className="mt-0.5 size-5 text-destructive" />
              )}
              <div>
                <h2 className="font-medium">
                  {checking ? 'Checking connection…' : status?.connected ? 'Connected' : 'Not connected'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {status?.message ?? 'Contacting Backlog…'}
                </p>
                {status?.space && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Space: {status.space.name} ({status.space.spaceKey}) · Method:{' '}
                    {method === 'oauth' ? 'OAuth' : 'API key'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => void refreshStatus()} disabled={checking}>
                <RefreshCwIcon className={checking ? 'animate-spin' : ''} />
                Check again
              </Button>
              <Button variant="destructive" onClick={() => void disconnect()} disabled={disconnecting}>
                {disconnecting ? 'Disconnecting…' : 'Disconnect'}
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex gap-3 border-b p-5 sm:p-6">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
              <KeyRoundIcon className="size-4" />
            </div>
            <div>
              <h2 className="font-medium">Authentication method</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Reconnect using OAuth or replace the connection with an API key.
              </p>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="mb-6 max-w-lg space-y-2">
              <label className="text-sm font-medium" htmlFor="auth-backlog-space-url">
                Backlog space URL
              </label>
              <Input
                id="auth-backlog-space-url"
                className="h-10"
                type="url"
                value={spaceUrl}
                onChange={(event) => setSpaceUrl(event.target.value)}
                placeholder="https://your-space.backlog.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                Required for both OAuth and API-key connections.
              </p>
            </div>
            <div className="mb-6 grid max-w-sm grid-cols-2 rounded-lg bg-muted p-1">
              <Button variant={method === 'oauth' ? 'secondary' : 'ghost'} onClick={() => setMethod('oauth')}>
                OAuth
              </Button>
              <Button variant={method === 'api-key' ? 'secondary' : 'ghost'} onClick={() => setMethod('api-key')}>
                API key
              </Button>
            </div>
            {method === 'oauth' ? (
              <_oauthForm spaceUrl={spaceUrl} onConnected={() => void refreshStatus()} />
            ) : (
              <_apiKeyForm
                spaceUrl={spaceUrl}
                actionLabel="Verify and save"
                showSavedKey
                onSaved={() => void refreshStatus()}
              />
            )}
          </div>
        </section>
      </main>
    </AppShell>
  )
}

function checkConnection(connection: BacklogConnection): Promise<ConnectionStatus> {
  if (connection.method === 'api-key') {
    return invoke<ConnectionStatus>('backlog_api_key_connection_status', {
      spaceUrl: connection.spaceUrl,
      apiKey: connection.apiKey ?? '',
    })
  }

  return invoke<ConnectionStatus>('backlog_connection_status', {
    spaceUrl: connection.spaceUrl,
    accessToken: connection.accessToken ?? '',
  })
}
