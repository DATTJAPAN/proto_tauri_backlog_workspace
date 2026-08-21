import type {PropsWithChildren} from "react"
import {TooltipProvider} from "@/components/ui/tooltip"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {SidebarLeft} from "@/components/sidebar-left.tsx";
import {SidebarRight} from "@/components/sidebar-right.tsx";

export function AppShell({children}: PropsWithChildren) {

    return (
        <div className="h-screen overflow-hidden">
            <TooltipProvider>
                <SidebarProvider className="h-full min-h-0">
                    <SidebarLeft/>
                    <SidebarInset className="h-full min-h-0 overflow-y-auto">
                        {children}
                    </SidebarInset>
                    <SidebarRight/>
                </SidebarProvider>
            </TooltipProvider>
        </div>
    )
}
