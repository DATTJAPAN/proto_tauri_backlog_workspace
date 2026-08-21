import {createFileRoute, redirect, useNavigate, useRouter} from '@tanstack/react-router'
import {ListTodoIcon} from 'lucide-react'
import {useEffect} from 'react'

import {backlog} from '@/backlog/Backlog'
import {Separator} from '@/components/ui/separator'
import {SidebarTrigger} from '@/components/ui/sidebar'
import {AppShell} from '@/layout/shell/app-shell'
import {CreateIssueForm} from './_components/_create-issue-form'

export const Route = createFileRoute('/issues/create/')({
    beforeLoad: async () => {
        if (!(await backlog.isConnected())) throw redirect({to: '/on-boarding'})
    },
    loader: async ({context}) => {
        const projectId = backlog.projects.getActiveId()
        if (!projectId) throw redirect({to: '/'})

        const {queryClient} = context

        await Promise.all([
            queryClient.ensureQueryData({
                queryKey: ['backlog', 'resolution', 'list', 'backlog_resolution_list'],
                queryFn: () => backlog.resolution.getAll(),
            }),
            queryClient.ensureQueryData({
                queryKey: ['backlog', 'priority', 'list', 'backlog_priority_list'],
                queryFn: () => backlog.priority.getAll(),
            }),
            queryClient.ensureQueryData({
                queryKey: ['backlog', 'project', 'user', 'list', 'backlog_project_user_list', String(projectId), {excludeGroupMembers: false}],
                queryFn: () => backlog.projectUsers.getAll(projectId, {excludeGroupMembers: false}),
            }),
            queryClient.ensureQueryData({
                queryKey: ['backlog', 'project', 'category', 'list', 'backlog_project_category_list', String(projectId)],
                queryFn: () => backlog.projectCategory.getAll(projectId),
            }),
            queryClient.ensureQueryData({
                queryKey: ["backlog", 'project', "issue_type", "list", "backlog_project_issue_type_list", String(projectId)],
                queryFn: () => backlog.projectIssueTypes.getAll(projectId),
            }),
            queryClient.ensureQueryData({
                queryKey: ["backlog", "project", 'status', "list", "backlog_project_status_list", String(projectId)],
                queryFn: () => backlog.projectStatus.getAll(projectId),
            }),
            queryClient.ensureQueryData({
                queryKey: ['backlog', 'project', 'version_and_milestone', 'list', 'backlog_project_version_and_milestone_list', String(projectId)],
                queryFn: () => backlog.projectVersionAndMilestone.getAll(projectId),
            }),
        ])

        return {projectId}
    },
    component: CreateIssuePage,
})

function CreateIssuePage() {
    const {projectId} = Route.useLoaderData()
    const navigate = useNavigate()
    const router = useRouter()

    useEffect(() => {
        return backlog.projects.onActiveChanged((newProjectId) => {
            if (!newProjectId) {
                void navigate({to: '/'})
                return
            }

            if (newProjectId !== projectId) {
                void router.invalidate()
            }
        })
    }, [projectId, navigate, router])

    return (
        <AppShell>
            <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
                <SidebarTrigger/>
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-4"/>
                <ListTodoIcon className="size-4 text-muted-foreground"/>
                <span className="text-sm font-medium">Create Issues</span>
            </header>

            <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-5">
                    <CreateIssueForm key={projectId} projectIdOrKey={projectId}/>
                </div>
            </main>
        </AppShell>
    )
}