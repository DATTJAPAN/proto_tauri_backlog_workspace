import {useState} from 'react'
import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router'
import {InfoIcon, ShieldCheckIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {EmptyShell} from '@/layout/shell/empty-shell'
import {backlog} from '@/backlog/backlog'
import {_oauthForm} from "@/routes/on-boarding/_component/_oauth-form.tsx";
import {_apiKeyForm} from "@/routes/on-boarding/_component/_api-key-form.tsx";
import {BacklogAuthMethod} from "@/backlog/auth.ts";

export const Route = createFileRoute('/on-boarding/')({
    beforeLoad: async () => {
        if (await backlog.isConnected()) {
            throw redirect({to: '/dashboard'})
        }
    },
    component: OnboardingPage,
})

function OnboardingPage() {
    const navigate = useNavigate()

    const [method, setMethod] = useState<BacklogAuthMethod>('oauth')

    const [spaceUrl, setSpaceUrl] = useState('https://dattjapan.backlog.com')

    const complete = () => void navigate({to: '/dashboard'})

    return (
        <EmptyShell>
            <section className="w-full max-w-lg rounded-xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
                <div className="mb-6 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheckIcon className="size-5"/>
                </div>
                <p className="text-sm font-medium text-primary">Welcome to DATT</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Connect your Backlog workspace</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose how this app should authenticate with
                    Backlog.</p>

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
                    <p className="text-xs text-muted-foreground">Use the full URL for the workspace you want to
                        connect.</p>
                </div>

                <div className="my-6 grid grid-cols-2 rounded-lg bg-muted p-1">
                    <Button variant={method === 'oauth' ? 'secondary' : 'ghost'}
                            onClick={() => setMethod('oauth')}>OAuth</Button>
                    <Button variant={method === 'api-key' ? 'secondary' : 'ghost'} onClick={() => setMethod('api-key')}>API
                        key</Button>
                </div>

                {method === 'oauth' ? (
                    <_oauthForm spaceUrl={spaceUrl} onConnected={complete} />
                ) : (
                    <_apiKeyForm spaceUrl={spaceUrl} actionLabel="Verify and continue" onSaved={complete} />
                )}

                <div className="mt-6 flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                    <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary"/>
                    <p className="leading-5">You can reconnect or change authentication method anytime from <span
                        className="font-medium">Settings → Backlog</span>.</p>
                </div>
            </section>
        </EmptyShell>
    )
}
