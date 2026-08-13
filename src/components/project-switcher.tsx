import {useEffect, useState} from 'react'
import {ArchiveIcon, CheckIcon, ChevronDownIcon, FolderKanbanIcon, LoaderCircleIcon} from 'lucide-react'

import {backlog} from '@/backlog/backlog'
import type {BacklogProject} from '@/backlog/project'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from '@/components/ui/sidebar'

type ProjectSwitcherProps = {
    projects: BacklogProject[]
    loading: boolean
    error: string | null
}

export function ProjectSwitcher({projects, loading, error}: ProjectSwitcherProps) {
    const [activeProjectId, setActiveProjectId] = useState<number | null>(() => backlog.projects.getActiveId())
    const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0]

    useEffect(() => {
        if (loading) return

        if (!projects.some((project) => project.id === activeProjectId)) {
            const fallbackProjectId = projects[0]?.id ?? null
            setActiveProjectId(fallbackProjectId)

            if (fallbackProjectId === null) {
                backlog.projects.clearActive()
            } else {
                backlog.projects.setActive(fallbackProjectId)
            }
        }
    }, [activeProjectId, loading, projects])

    function selectProject(projectId: number) {
        setActiveProjectId(projectId)
        backlog.projects.setActive(projectId)
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        disabled={loading || projects.length === 0}
                        render={<SidebarMenuButton
                            className="h-auto w-full min-w-0 overflow-hidden px-1.5 py-1.5 aria-expanded:bg-muted aria-expanded:text-foreground"/>}
                    >
                        <div
                            className="flex aspect-square size-5 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                            {loading ? <LoaderCircleIcon className="animate-spin"/> : <FolderKanbanIcon/>}
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                            <div className="truncate font-medium">
                                {loading ? 'Loading projects…' : activeProject?.name ?? (error ? 'Projects unavailable' : 'No projects')}
                            </div>
                            {activeProject && (
                                <div className="truncate text-xs text-muted-foreground">{activeProject.projectKey}</div>
                            )}
                        </div>
                        {!loading && projects.length > 0 && <ChevronDownIcon className="ml-auto shrink-0 opacity-50"/>}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 max-w-[calc(100vw-1rem)] rounded-lg" align="start"
                                         side="bottom" sideOffset={4}>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Projects</DropdownMenuLabel>
                            {projects.map((project) => (
                                <DropdownMenuItem
                                    key={project.id}
                                    onClick={() => selectProject(project.id)}
                                    className="min-w-0 gap-2 overflow-hidden p-2 data-[active=true]:bg-accent"
                                    data-active={project.id === activeProject?.id}
                                    aria-current={project.id === activeProject?.id ? 'true' : undefined}
                                >
                                    <div className="flex size-6 shrink-0 items-center justify-center rounded-xs border">
                                        {project.archived ? <ArchiveIcon className="size-3.5"/> :
                                            <FolderKanbanIcon className="size-3.5"/>}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate">{project.name}</div>
                                        <div
                                            className="truncate text-xs text-muted-foreground">{project.projectKey}</div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {project.archived && <span
                                            className="max-w-16 truncate text-xs text-muted-foreground">Archived</span>}
                                        {project.id === activeProject?.id &&
                                            <CheckIcon className="size-4 text-primary"/>}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                {error && <p className="px-2 pt-1 text-xs text-destructive">{error}</p>}
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
