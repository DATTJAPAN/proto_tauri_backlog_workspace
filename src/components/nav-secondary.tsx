import React from "react"
import {Link, useLocation} from "@tanstack/react-router"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {h_navigation_is_active} from '@/helper/navigation'

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    badge?: React.ReactNode
    isActive?: boolean
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = useLocation({select: (location) => location.pathname})

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="border-l-2 border-transparent data-active:border-orange-500 data-active:bg-orange-200 data-active:text-orange-950 data-active:[&_svg]:text-orange-700 dark:data-active:bg-orange-950/70 dark:data-active:text-orange-100 dark:data-active:[&_svg]:text-orange-300"
                isActive={item.isActive ?? h_navigation_is_active(pathname, item.url)}
                render={<Link to={item.url} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
