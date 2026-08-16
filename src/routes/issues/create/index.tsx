import {createFileRoute} from '@tanstack/react-router'
import {CreateIssueForm} from "@/routes/issues/create/_components/_create-issue-form.tsx";
import {AppShell} from "@/layout/shell/app-shell.tsx";
import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {ListTodoIcon} from "lucide-react";


export const Route = createFileRoute('/issues/create/')({
    component: CreateIssuePage,
})

function CreateIssuePage() {

    return (
        <AppShell>
            <header className="sticky top-0 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
                <SidebarTrigger/>
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-4"/>
                <ListTodoIcon className="size-4 text-muted-foreground"/>
                <span className="text-sm font-medium">Create Issues</span>
            </header>

            <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-5">

                    <CreateIssueForm/>
                </div>
            </main>
        </AppShell>
    )
}
