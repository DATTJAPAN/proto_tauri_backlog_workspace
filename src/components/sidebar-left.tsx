"use client"

import * as React from "react"
import {HomeIcon, ListTodoIcon, ShieldCheckIcon} from 'lucide-react'

import {NavMain, type NavMainItem} from "@/components/nav-main"
import {NavSecondary} from "@/components/nav-secondary"
import {ProjectSwitcher} from "@/components/project-switcher"
import {backlog} from '@/backlog/Backlog'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

const data: { navMain: NavMainItem[]; navSecondary: { title: string; url: string; icon: React.ReactNode }[] } = {
    navMain: [
        {
            title: "Home",
            url: "/dashboard/",
            icon: <HomeIcon/>,
        },
        {
            title: "Issues",
            icon: <ListTodoIcon/>,
            activePrefix: "/issues", // Keeps menu open for /issues, /issues/create, /issues/123, etc.
            items: [
                {
                    title: "Issue List",
                    url: "/issues/",
                    exact: true,
                },
                {
                    title: "Add Issues",
                    url: "/issues/create/",
                    exact: true,
                },
            ],
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

export function SidebarLeft({...props}: React.ComponentProps<typeof Sidebar>) {
    const {
        data: projects = [],
        isLoading: loadingProjects,
        error: projectErrorObj,
    } = backlog.projects.useGetAll()

    const projectError = projectErrorObj?.message ?? null

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