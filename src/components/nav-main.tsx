"use client"

import type { ReactNode } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { ChevronRightIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { h_navigation_is_active } from '@/helper/navigation'

export type NavSubItem = {
    title: string
    url: string
    exact?: boolean
    isActive?: boolean
}

export type NavMainItem = {
    title: string
    url?: string
    exact?: boolean
    icon: ReactNode
    isActive?: boolean
    /** Route prefix that keeps this section active (e.g., "/issues") */
    activePrefix?: string
    items?: NavSubItem[]
}

export type NavMainProps = {
    items: NavMainItem[]
}

export function NavMain({ items }: NavMainProps) {
    const pathname = useLocation({ select: (location) => location.pathname })

    return (
        <SidebarMenu>
            {items.map((item) => {
                const hasSubItems = Boolean(item.items && item.items.length > 0)

                if (!hasSubItems) {
                    const isActive =
                        item.isActive ??
                        h_navigation_is_active(pathname, item.url!, item.exact ?? false)

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                className="border-l-2 border-transparent data-active:border-orange-500 data-active:bg-orange-200 data-active:text-orange-950 data-active:[&_svg]:text-orange-700 dark:data-active:bg-orange-950/70 dark:data-active:text-orange-100 dark:data-active:[&_svg]:text-orange-300"
                                isActive={isActive}
                                render={<Link to={item.url!} />}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                }

                return <NavMainCollapsibleGroup key={item.title} item={item} pathname={pathname} />
            })}
        </SidebarMenu>
    )
}

function NavMainCollapsibleGroup({ item, pathname }: { item: NavMainItem; pathname: string }) {
    // Determines if current route falls under this section's prefix
    const prefix = item.activePrefix ?? item.url ?? '/issues'
    const isGroupActive =
        item.isActive ??
        h_navigation_is_active(pathname, prefix, false)

    return (
        <Collapsible
            // Key forces defaultOpen to re-evaluate when entering/leaving the section
            key={isGroupActive ? "active" : "inactive"}
            defaultOpen={isGroupActive}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger
                    render={
                        <SidebarMenuButton
                            className="border-l-2 border-transparent data-active:border-orange-500 data-active:bg-orange-200 data-active:text-orange-950 data-active:[&_svg]:text-orange-700 dark:data-active:bg-orange-950/70 dark:data-active:text-orange-100 dark:data-active:[&_svg]:text-orange-300"
                            isActive={isGroupActive}
                        />
                    }
                >
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 group-data-[open]/collapsible:rotate-90 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                            const isSubActive =
                                subItem.isActive ??
                                h_navigation_is_active(pathname, subItem.url, subItem.exact ?? true)

                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                        isActive={isSubActive}
                                        className="data-active:bg-orange-200/60 data-active:font-medium data-active:text-orange-950 dark:data-active:bg-orange-950/50 dark:data-active:text-orange-100"
                                        render={<Link to={subItem.url} />}
                                    >
                                        <span>{subItem.title}</span>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}