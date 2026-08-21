import {Link} from '@tanstack/react-router'
import {AlertCircleIcon, ArrowLeftIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Skeleton} from '@/components/ui/skeleton'
import {SidebarTrigger} from '@/components/ui/sidebar'
import {AppShell} from '@/layout/shell/app-shell'

export function IssuePendingPage() {
    return (
        <AppShell>
            <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
                <SidebarTrigger/><Skeleton className="h-4 w-40"/>
            </header>
            <main className="flex-1 space-y-5 overflow-hidden p-6">
                <Skeleton className="h-36 w-full"/>
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
                    <Skeleton className="h-96"/><Skeleton className="h-80"/>
                </div>
            </main>
        </AppShell>
    )
}

export function IssueErrorPage({error}: {error: Error}) {
    return (
        <AppShell>
            <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
                <SidebarTrigger/>
                <Button variant="ghost" size="sm" render={<Link to="/issues"/>}>
                    <ArrowLeftIcon/> Issues
                </Button>
            </header>
            <main className="flex-1 p-6">
                <div role="alert" className="mx-auto flex max-w-3xl items-start gap-3 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                    <AlertCircleIcon className="mt-0.5 size-4 shrink-0"/>
                    <div>
                        <p className="font-medium">Unable to load issue</p>
                        <p className="mt-1">{error.message}</p>
                    </div>
                </div>
            </main>
        </AppShell>
    )
}
