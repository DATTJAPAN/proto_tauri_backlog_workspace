import * as React from "react"

import {DatePicker} from "@/components/date-picker"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar"
import {backlog} from '@/backlog/Backlog'

export function SidebarRight({...props}: React.ComponentProps<typeof Sidebar>) {
    const {data: user = null, isLoading: loadingUser} = backlog.users.useGetCurrent()

    return (
        <Sidebar
            collapsible="none"
            className="sticky top-0 hidden h-svh border-l lg:flex"
            {...props}
        >
            <SidebarHeader className="h-16 border-b border-sidebar-border">
                <NavUser user={user} loading={loadingUser}/>
            </SidebarHeader>
            <SidebarContent>
                <DatePicker/>
            </SidebarContent>
        </Sidebar>
    )
}