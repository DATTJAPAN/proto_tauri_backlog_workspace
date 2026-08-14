import {createFileRoute, redirect} from '@tanstack/react-router'

import {backlog} from '@/backlog/Backlog'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {AppShell} from '@/layout/shell/app-shell'
import {IssueAttachments} from './_components/issue-attachments'
import {IssueComments} from './_components/issue-comments'
import {IssueDetails, IssuePeople, IssueTitle} from './_components/issue-overview'
import {IssueErrorPage, IssuePendingPage} from './_components/issue-route-states'
import {IssueViewHeader} from './_components/issue-view-header'
import {IssueMarkdown} from './_components/issue-markdown'

export const Route = createFileRoute('/issues/$issueIdOrKey/')({
    beforeLoad: async () => {
        if (!await backlog.isConnected()) throw redirect({to: '/on-boarding'})
    },
    loader: ({params}) => backlog.issues.get(params.issueIdOrKey),
    pendingComponent: IssuePendingPage,
    errorComponent: IssueErrorPage,
    component: IssuePage,
})

function IssuePage() {
    const issue = Route.useLoaderData()

    return (
        <AppShell>
            <IssueViewHeader issueKey={issue.issueKey}/>
            <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-5">
                    <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
                        <div className="flex min-w-0 flex-col gap-5">
                            <IssueTitle issue={issue}/>
                            <Card className="min-h-80 flex-1">
                                <CardHeader className="border-b">
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {issue.description?.trim() ? (
                                        <IssueMarkdown
                                            issueIdOrKey={issue.issueKey}
                                            content={issue.description}
                                            attachments={issue.attachments}
                                            className="typeset-issue"
                                        />
                                    ) : (
                                        <p className="py-8 text-center text-sm text-muted-foreground">
                                            No description was provided.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <aside className="min-w-0 space-y-5 self-stretch">
                            <IssueDetails issue={issue}/>
                            <IssuePeople issue={issue}/>
                            {issue.attachments.length > 0 && (
                                <IssueAttachments attachments={issue.attachments}/>
                            )}
                        </aside>
                    </div>
                    <IssueComments issueIdOrKey={issue.issueKey} attachments={issue.attachments}/>
                </div>
            </main>
        </AppShell>
    )
}
