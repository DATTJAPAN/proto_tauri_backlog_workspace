import {Link} from '@tanstack/react-router'
import {openUrl} from '@tauri-apps/plugin-opener'
import {ArrowLeftIcon, ExternalLinkIcon} from 'lucide-react'

import {backlog} from '@/backlog/Backlog'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {SidebarTrigger} from '@/components/ui/sidebar'

export function IssueViewHeader({issueKey}: {issueKey: string}) {
    async function openInBacklog() {
        const connection = await backlog.getConnection()
        if (!connection) return

        await openUrl(`${connection.spaceUrl.replace(/\/$/, '')}/view/${encodeURIComponent(issueKey)}`)
    }

    return (
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
            <SidebarTrigger/>
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4"/>
            <Button variant="ghost" size="sm" render={<Link to="/issues"/>}>
                <ArrowLeftIcon/> Issues
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="min-w-0 truncate font-mono text-sm font-medium">{issueKey}</span>
            <Button className="ms-auto" variant="outline" size="sm" onClick={() => void openInBacklog()}>
                <ExternalLinkIcon/> Open in Backlog
            </Button>
        </header>
    )
}
