import {useEffect, useMemo, useState} from 'react'
import {createFileRoute, redirect} from '@tanstack/react-router'
import type {PaginationState} from '@tanstack/react-table'
import {AlertCircleIcon, ArrowRightIcon, CheckCircle2Icon, CircleIcon, FlagIcon, ListTodoIcon} from 'lucide-react'

import {backlog} from '@/backlog/Backlog'
import {DataTable} from '@/components/shadcn'
import {Separator} from '@/components/ui/separator'
import {SidebarTrigger} from '@/components/ui/sidebar'
import {AppShell} from '@/layout/shell/app-shell'
import {issueColumns} from './_components/column-def'

const PAGE_SIZE = 50

export const Route = createFileRoute('/issues/')({
    beforeLoad: async () => {
        if (!await backlog.isConnected()) throw redirect({to: '/on-boarding'})
    },
    component: IssuesPage,
})

function IssuesPage() {
    const [projectId, setProjectId] = useState(() => backlog.projects.getActiveId())
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: PAGE_SIZE})

    // Calling TanStack Query hooks directly on the backlog singleton instance
    const {
        data: issues = [],
        isLoading: isIssuesLoading,
        error: issuesError,
    } = backlog.issues.useGetAll({
        projectId: projectId ?? 0,
        order: 'desc',
        offset: pagination.pageIndex * pagination.pageSize,
        count: pagination.pageSize,
    })

    const {
        data: totalCount = 0,
        isLoading: isCountLoading,
        error: countError,
    } = backlog.issues.useGetCount(projectId)

    const loading = isIssuesLoading || isCountLoading
    const error = issuesError?.message ?? countError?.message ?? null

    const columns = useMemo(() => {
        const longestKeyLength = issues.reduce((length, issue) => Math.max(length, issue.issueKey.length), 0)
        const keyColumnSize = Math.max(120, longestKeyLength * 8 + 32)

        return issueColumns.map((column) => column.id === 'issueKey'
            ? {...column, size: keyColumnSize, minSize: keyColumnSize, maxSize: keyColumnSize}
            : column)
    }, [issues])

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

            <main className="flex min-h-0 min-w-0 flex-1 flex-col p-4 sm:p-6">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Issues for the selected Backlog project.</p>
                    </div>
                </div>

                {error && (
                    <div role="alert"
                         className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        <AlertCircleIcon className="mt-0.5 size-4 shrink-0"/>
                        <div>
                            <p className="font-medium">Unable to load issues</p>
                            <p className="mt-0.5 text-destructive/90">{error}</p>
                        </div>
                    </div>
                )}
                <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 border px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Legend</span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-teal-500"/> Status color
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2Icon className="size-3.5 text-emerald-600"/> Resolved
                        <CircleIcon className="size-3.5 text-muted-foreground/60"/> Not resolved
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="h-4 min-w-8 bg-lime-700 px-1 text-center text-[10px] leading-4 text-white">Type</span>
                        Issue type
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <FlagIcon className="size-3.5 fill-red-500 text-red-500"/> High
                        <FlagIcon className="size-3.5 fill-amber-500 text-amber-500"/> Normal
                        <FlagIcon className="size-3.5 fill-blue-500 text-blue-500"/> Low
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="size-4 rounded-full ring-2 ring-sky-500 ring-offset-1 ring-offset-background"/> Creator
                        <ArrowRightIcon className="size-3"/>
                        <span className="size-4 rounded-full ring-2 ring-orange-500 ring-offset-1 ring-offset-background"/> Assignee
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="size-4 rounded-full ring-2 ring-sky-500 ring-offset-1 ring-offset-background outline-2 outline-offset-2 outline-orange-500"/>
                        Creator and assignee
                    </span>
                </div>
                <DataTable
                    columns={columns}
                    data={issues}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    totalCount={totalCount}
                    loading={loading}
                    initialColumnPinning={{start: ['issueKey', 'summary'], end: []}}
                    initialColumnVisibility={{resolved: false, estimatedHours: false, actualHours: false}}
                    emptyDescription={projectId === null ? 'Select a project to view its issues.' : 'No issues were found for the selected project.'}
                    getRowId={(issue) => String(issue.id)}
                />
            </main>
        </AppShell>
    )
}