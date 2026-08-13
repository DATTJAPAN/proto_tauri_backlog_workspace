import type {PropsWithChildren} from "react"
import {TooltipProvider} from "@/components/ui/tooltip"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {SidebarLeft} from "@/components/sidebar-left.tsx";
import {SidebarRight} from "@/components/sidebar-right.tsx";

export function AppShell({children}: PropsWithChildren) {

    return (
        <div>
            <TooltipProvider>
                <SidebarProvider>
                    <SidebarLeft/>
                    <SidebarInset>
                        {children}
                    </SidebarInset>
                    <SidebarRight/>
                </SidebarProvider>
            </TooltipProvider>
        </div>
    )
}
