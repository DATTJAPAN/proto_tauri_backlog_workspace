import type {ReactNode} from 'react'
import {CalendarDaysIcon, ClockIcon, FileIcon, FlagIcon, ListTodoIcon, UserIcon} from 'lucide-react'

import type {BacklogProjectIssue} from '@/backlog/BacklogProjectIssues'
import type {BacklogUser} from '@/backlog/BacklogUsers'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Badge} from '@/components/ui/badge'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {h_color_adjust, h_color_contrast} from '@/helper/color'
import {h_datefns_date, h_datefns_datetime, h_datefns_is_overdue} from '@/helper/datefns'

export function IssueTitle({issue}: {issue: BacklogProjectIssue}) {
    const typeBackground = h_color_adjust({
        color: issue.issueType.color,
        strategy: 'auto',
        adjustment: 'auto',
        basisColor: '#ffffff',
    })

    const overdue = !isClosed(issue) && h_datefns_is_overdue({value: issue.dueDate})

    return (
        <section className="border bg-card p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-muted-foreground">{issue.issueKey}</span>
                <Badge style={{
                    backgroundColor: typeBackground,
                    borderColor: typeBackground,
                    color: h_color_contrast({color: typeBackground, overrideColor: '#ffffff'}),
                }}>
                    {issue.issueType.name}
                </Badge>
                <Badge variant="outline">
                    <span className="size-2 rounded-full" style={{backgroundColor: issue.status.color}}/>
                    {issue.status.name}
                    {overdue && <span role="img" aria-label="Overdue" title="Overdue">🔥</span>}
                </Badge>
            </div>
            <h1 className="wrap-break-word text-2xl font-semibold tracking-tight sm:text-3xl">{issue.summary}</h1>
            <p className="mt-3 text-xs text-muted-foreground">
                Created {h_datefns_datetime({value: issue.created})} · Updated {h_datefns_datetime({value: issue.updated})}
            </p>
        </section>
    )
}

export function IssueDetails({issue}: {issue: BacklogProjectIssue}) {
    return (
        <Card>
            <CardHeader className="border-b"><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Detail label="Status" icon={<ListTodoIcon/>}>
                    <span className="inline-flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{backgroundColor: issue.status.color}}/>
                        {issue.status.name}
                    </span>
                </Detail>
                <Detail label="Priority" icon={<FlagIcon/>}>{issue.priority.name}</Detail>
                <Detail label="Resolution" icon={<ListTodoIcon/>}>{issue.resolution?.name ?? 'Unresolved'}</Detail>
                <Detail label="Start date" icon={<CalendarDaysIcon/>}>{h_datefns_date({value: issue.startDate})}</Detail>
                <Detail label="Due date" icon={<CalendarDaysIcon/>}>{h_datefns_date({value: issue.dueDate})}</Detail>
                <Detail label="Estimated" icon={<ClockIcon/>}>{formatHours(issue.estimatedHours)}</Detail>
                <Detail label="Actual" icon={<ClockIcon/>}>{formatHours(issue.actualHours)}</Detail>
                {issue.category.length > 0 && (
                    <Detail label="Categories" icon={<FileIcon/>}>
                        <div className="flex flex-wrap justify-end gap-1">
                            {issue.category.map((category) => (
                                <Badge key={category.id} variant="secondary">{category.name}</Badge>
                            ))}
                        </div>
                    </Detail>
                )}
                {issue.milestone.length > 0 && (
                    <Detail label="Milestones" icon={<FlagIcon/>}>
                        {issue.milestone.map((milestone) => milestone.name).join(', ')}
                    </Detail>
                )}
            </CardContent>
        </Card>
    )
}

export function IssuePeople({issue}: {issue: BacklogProjectIssue}) {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Person label="Creator" user={issue.createdUser}/>
                <Person label="Assignee" user={issue.assignee}/>
                <Person label="Last updated by" user={issue.updatedUser}/>
            </CardContent>
        </Card>
    )
}

function Detail({label, icon, children}: {label: string; icon: ReactNode; children: ReactNode}) {
    return (
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b pb-3 last:border-0 last:pb-0">
            <span className="inline-flex items-center gap-2 text-muted-foreground [&_svg]:size-3.5">
                {icon}{label}
            </span>
            <div className="min-w-0 max-w-44 text-end font-medium">{children}</div>
        </div>
    )
}

function Person({label, user}: {label: string; user: BacklogUser | null}) {
    return (
        <div className="flex items-center gap-3">
            <Avatar size="sm">
                {user?.nulabAccount?.iconUrl && <AvatarImage src={user.nulabAccount.iconUrl} alt={user.name}/>}
                <AvatarFallback>{user ? initials(user.name) : <UserIcon className="size-3"/>}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">{label}</p>
                <p className="truncate text-xs font-medium" title={user?.name}>{user?.name ?? 'Unassigned'}</p>
            </div>
        </div>
    )
}

function isClosed(issue: BacklogProjectIssue): boolean {
    return issue.status.id === 4 || issue.status.name.trim().toLowerCase() === 'closed'
}

function initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function formatHours(value: number | null): string {
    return value === null ? '—' : `${value}h`
}
