import {useCallback, useEffect, useState} from 'react'
import {createFileRoute, redirect} from '@tanstack/react-router'
import type {PaginationState} from '@tanstack/react-table'
import {AlertCircleIcon, ListTodoIcon, LoaderCircleIcon} from 'lucide-react'

import {backlog} from '@/backlog/Backlog'
import type {BacklogProjectIssue} from '@/backlog/BacklogProjectIssues'
import {DataTable} from '@/components/shadcn'
import {Separator} from '@/components/ui/separator'
import {SidebarTrigger} from '@/components/ui/sidebar'
import {AppShell} from '@/layout/shell/app-shell'
import {issueColumns} from './_components/column-def'

const PAGE_SIZE = 20

export const Route = createFileRoute('/issues/')({
    beforeLoad: async () => {
        if (!await backlog.isConnected()) throw redirect({to: '/on-boarding'})
    },
    component: IssuesPage,
})

function IssuesPage() {
    const [issues, setIssues] = useState<BacklogProjectIssue[]>([])
    const [projectId, setProjectId] = useState(() => backlog.projects.getActiveId())
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: PAGE_SIZE})
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadIssues = useCallback(async (activeProjectId: number | null, pageOffset: number, count: number) => {
        if (activeProjectId === null) {
            setIssues([])
            setTotalCount(0)
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)
        try {
            const [nextIssues, nextTotalCount] = await Promise.all([
                backlog.issues.getAll({projectId: activeProjectId, order: 'desc', offset: pageOffset, count}),
                backlog.issues.getCount(activeProjectId),
            ])
            setIssues(nextIssues)
            setTotalCount(nextTotalCount)
        } catch (cause) {
            setIssues([])
            setTotalCount(0)
            setError(cause instanceof Error ? cause.message : String(cause))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadIssues(projectId, pagination.pageIndex * pagination.pageSize, pagination.pageSize)
    }, [loadIssues, pagination, projectId])

    useEffect(() => backlog.projects.onActiveChanged((nextProjectId) => {
        setProjectId(nextProjectId)
        setPagination((current) => ({...current, pageIndex: 0}))
    }), [])

    return (
        <AppShell>
            <header className="sticky top-0 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
                <SidebarTrigger/>
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-4"/>
                <ListTodoIcon className="size-4 text-muted-foreground"/>
                <span className="text-sm font-medium">Issues</span>
            </header>

            <main className="min-w-0 flex-1 p-4 sm:p-6">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Issues for the selected Backlog project.</p>
                    </div>
                    {loading && <LoaderCircleIcon className="size-5 animate-spin text-muted-foreground"/>}
                </div>

                {error && (
                    <div role="alert"
                         className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        <AlertCircleIcon className="mt-0.5 size-4 shrink-0"/>
                        <div><p className="font-medium">Unable to load issues</p><p
                            className="mt-0.5 text-destructive/90">{error}</p></div>
                    </div>
                )}
                <DataTable
                    columns={issueColumns}
                    data={issues}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    totalCount={totalCount}
                    loading={loading}
                    emptyDescription={projectId === null ? 'Select a project to view its issues.' : 'No issues were found for the selected project.'}
                    getRowId={(issue) => String(issue.id)}
                />
            </main>
        </AppShell>
    )
}
