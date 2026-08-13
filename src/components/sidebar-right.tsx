import * as React from "react"

import { DatePicker } from "@/components/date-picker"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {backlog} from '@/backlog/backlog'
import type {BacklogUser} from '@/backlog/user'

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<BacklogUser | null>(null)
  const [loadingUser, setLoadingUser] = React.useState(true)

  React.useEffect(() => {
    let active = true
    void backlog.users.getCurrent()
      .then((result) => { if (active) setUser(result) })
      .finally(() => { if (active) setLoadingUser(false) })
    return () => { active = false }
  }, [])

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={user} loading={loadingUser} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
      </SidebarContent>
    </Sidebar>
  )
}
