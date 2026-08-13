import {type FormEvent, useEffect, useState} from 'react'
import {invoke} from '@tauri-apps/api/core'
import {CheckCircle2Icon, EyeIcon, EyeOffIcon, KeyRoundIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {backlog} from '@/backlog/backlog'

type ConnectionStatus = {
  connected: boolean
  message: string
}
 
type BacklogApiKeyFormProps = {
  spaceUrl: string
  actionLabel: string
  onSaved?: () => void
  showSavedKey?: boolean
}

export function _apiKeyForm({
  spaceUrl,
  actionLabel,
  onSaved,
  showSavedKey = false,
}: BacklogApiKeyFormProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!showSavedKey) return

    let active = true
    void backlog.getConnection().then((connection) => {
      if (active && connection?.method === 'api-key') setApiKey(connection.apiKey ?? '')
    })
    return () => { active = false }
  }, [showSavedKey])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!apiKey.trim()) return

    setIsSaving(true)
    setError(null)
    try {
      const status = await invoke<ConnectionStatus>('backlog_api_key_connection_status', {
        spaceUrl: spaceUrl.trim(),
        apiKey: apiKey.trim(),
      })
      if (!status.connected) throw new Error(status.message)
      await backlog.connectWithApiKey(spaceUrl, apiKey)
      setSaved(true)
      onSaved?.()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="backlog-api-key">
          Backlog API key
        </label>
        <div className="relative">
          <KeyRoundIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          {/* `hide-native-password-toggle` is defined in app.css. It hides WebView2's
              native password controls because the custom toggle below provides the
              same action; showing both produces duplicate eye icons. */}
          <Input
            id="backlog-api-key"
            className="hide-native-password-toggle h-10 pr-10 pl-9"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(event) => {
              setApiKey(event.target.value)
              setSaved(false)
              setError(null)
            }}
            placeholder="Enter your Backlog API key"
            autoComplete="off"
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setShowKey((current) => !current)}
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Your key is saved only on this device and is used to connect to Backlog.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button className="h-9 px-4" type="submit" disabled={!spaceUrl.trim() || !apiKey.trim() || isSaving}>
          {isSaving ? 'Checking connection…' : actionLabel}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-primary" role="status">
            <CheckCircle2Icon className="size-4" /> Saved
          </span>
        )}
      </div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    </form>
  )
}
