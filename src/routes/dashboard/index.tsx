import {createFileRoute, redirect} from '@tanstack/react-router'

import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from '@/components/ui/breadcrumb'
import {Separator} from '@/components/ui/separator'
import {SidebarTrigger} from '@/components/ui/sidebar'
import {AppShell} from '@/layout/shell/app-shell'
import {backlog} from '@/backlog/Backlog'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async () => {
    if (!await backlog.isConnected()) {
      throw redirect({to: '/on-boarding'})
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <AppShell>
      <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  Project Management &amp; Task Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
        <div className="mx-auto h-screen w-full max-w-3xl rounded-xl bg-muted/50" />
      </div>
    </AppShell>
  )
}
