import {useEffect, useRef, useState} from 'react'
import {listen, type UnlistenFn} from '@tauri-apps/api/event'
import {invoke} from '@tauri-apps/api/core'
import {openUrl} from '@tauri-apps/plugin-opener'
import {CheckCircle2Icon, ExternalLinkIcon, LoaderCircleIcon, ShieldCheckIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {backlog} from '@/backlog/Backlog'

type OAuthCallback = { code: string; state?: string }
type AuthorizationRequest = { authorizationUrl: string }
type OAuthToken = {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
}
type ConnectionStatus = {
    connected: boolean
    message: string
    space?: { spaceKey: string; name: string }
}

export function _oauthForm({spaceUrl, onConnected}: { spaceUrl: string; onConnected?: () => void }) {
    const [status, setStatus] = useState<'idle' | 'waiting' | 'exchanging' | 'connected'>('idle')
    const [error, setError] = useState<string | null>(null)
    const expectedState = useRef<string | null>(null)
    const unlistenRef = useRef<UnlistenFn | null>(null)

    useEffect(() => () => unlistenRef.current?.(), [])

    async function connect() {
        if (!spaceUrl.trim()) {
            setError('Backlog space URL is required.')
            return
        }
        setError(null)
        setStatus('waiting')
        expectedState.current = crypto.randomUUID()

        try {
            unlistenRef.current?.()
            unlistenRef.current = await listen<OAuthCallback>('backlog-oauth-callback', async ({payload}) => {
                if (payload.state !== expectedState.current) {
                    setError('OAuth state did not match. Please try connecting again.')
                    setStatus('idle')
                    return
                }

                setStatus('exchanging')
                try {
                    const token = await invoke<OAuthToken>('backlog_oauth_exchange_code', {
                        spaceUrl: spaceUrl.trim(),
                        code: payload.code,
                    })
                    const connection = await invoke<ConnectionStatus>('backlog_connection_status', {
                        spaceUrl: spaceUrl.trim(),
                        accessToken: token.access_token,
                    })
                    if (!connection.connected) throw new Error(connection.message)

                    await backlog.connectWithOAuth(spaceUrl, token.access_token, {
                        refreshToken: token.refresh_token,
                        tokenType: token.token_type,
                        expiresAt: Date.now() + token.expires_in * 1000,
                        spaceKey: connection.space?.spaceKey,
                        spaceName: connection.space?.name,
                    })
                    setStatus('connected')
                    unlistenRef.current?.()
                    unlistenRef.current = null
                    onConnected?.()
                } catch (cause) {
                    setError(cause instanceof Error ? cause.message : String(cause))
                    setStatus('idle')
                }
            })

            const {authorizationUrl} = await invoke<AuthorizationRequest>('backlog_oauth_authorization_url', {
                spaceUrl: spaceUrl.trim(),
                state: expectedState.current,
            })
            await openUrl(authorizationUrl)
        } catch (cause) {
            unlistenRef.current?.()
            unlistenRef.current = null
            setError(cause instanceof Error ? cause.message : String(cause))
            setStatus('idle')
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex gap-3 rounded-lg border bg-muted/40 p-4">
                <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-primary"/>
                <div>
                    <p className="text-sm font-medium">Connect securely with Backlog OAuth</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Your browser will open for approval, then return the result to this app automatically.
                    </p>
                </div>
            </div>

            <Button className="h-9 px-4" onClick={() => void connect()}
                    disabled={!spaceUrl.trim() || status === 'waiting' || status === 'exchanging'}>
                {status === 'waiting' || status === 'exchanging' ? (
                    <LoaderCircleIcon className="animate-spin"/>
                ) : status === 'connected' ? <CheckCircle2Icon/> : <ExternalLinkIcon/>}
                {status === 'waiting' ? 'Waiting for approval…' : status === 'exchanging' ? 'Completing connection…' : status === 'connected' ? 'Connected' : 'Connect with Backlog'}
            </Button>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        </div>
    )
}
