"use client"

import * as React from "react"
import {HomeIcon, ShieldCheckIcon} from 'lucide-react'

import {NavMain} from "@/components/nav-main"
import {NavSecondary} from "@/components/nav-secondary"
import {ProjectSwitcher} from "@/components/project-switcher"
import {backlog} from '@/backlog/Backlog'
import type {BacklogProject} from '@/backlog/BacklogProjects'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
const data = {
    navMain: [
        {
            title: "Home",
            url: "/dashboard/",
            icon: <HomeIcon/>,
        },
    ],
    navSecondary: [
        {
            title: "Authentication",
            url: "/auth/",
            icon: <ShieldCheckIcon/>,
        },
    ],
}

export function SidebarLeft({
                                ...props
                            }: React.ComponentProps<typeof Sidebar>) {
    const [projects, setProjects] = React.useState<BacklogProject[]>([])
    const [loadingProjects, setLoadingProjects] = React.useState(true)
    const [projectError, setProjectError] = React.useState<string | null>(null)

    React.useEffect(() => {
        let active = true
        void backlog.projects.getAll()
            .then((result) => {
                if (active) setProjects(result)
            })
            .catch((cause) => {
                if (active) setProjectError(cause instanceof Error ? cause.message : String(cause))
            })
            .finally(() => {
                if (active) setLoadingProjects(false)
            })

        return () => { active = false }
    }, [])

    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader>
                <ProjectSwitcher projects={projects} loading={loadingProjects} error={projectError}/>
                <NavMain items={data.navMain}/>
            </SidebarHeader>
            <SidebarContent>
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
