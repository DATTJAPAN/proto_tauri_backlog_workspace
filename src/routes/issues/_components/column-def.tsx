import type {ColumnDef} from '@tanstack/react-table'
import {Link} from '@tanstack/react-router'
import {ArrowRightIcon, CheckCircle2Icon, CircleIcon, FlagIcon} from 'lucide-react'

import type {BacklogProjectIssue} from '@/backlog/BacklogProjectIssues'
import type {BacklogUser} from '@/backlog/BacklogUsers'
import {DataTableColumnHeader, type DataTableFeatures} from '@/components/shadcn'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Badge} from '@/components/ui/badge'
import {h_color_adjust, h_color_contrast} from '@/helper/color'
import {h_datefns_date, h_datefns_datetime, h_datefns_is_overdue} from '@/helper/datefns'
import {cn} from '@/lib/utils'

const issueTypeColorCache = new Map<string, { backgroundColor: string; color: string }>()

export const issueColumns: ColumnDef<DataTableFeatures, BacklogProjectIssue, unknown>[] = [
    {
        id: 'issueKey', accessorKey: 'issueKey', size: 120,
        header: ({column}) => <DataTableColumnHeader column={column} title="Key"/>,
        cell: ({row}) => <Link
            to="/issues/$issueIdOrKey"
            params={{issueIdOrKey: row.original.issueKey}}
            className="whitespace-nowrap font-mono text-xs font-medium underline-offset-4 hover:underline"
        >{row.original.issueKey}</Link>,
    },
    {
        accessorKey: 'summary', size: 360,
        header: ({column}) => <DataTableColumnHeader column={column} title="Summary"/>,
        cell: ({row}) => <Link
            to="/issues/$issueIdOrKey"
            params={{issueIdOrKey: row.original.issueKey}}
            className="block truncate underline-offset-4 hover:underline"
            title={row.original.summary}
        >{row.original.summary}</Link>,
    },
    {
        id: 'status', size: 150, accessorFn: (issue) => issue.status.name,
        header: ({column}) => <DataTableColumnHeader column={column} title="Status"/>,
        cell: ({row}) => <span className="inline-flex items-center gap-1.5"><span
            className="size-2 shrink-0 rounded-full"
            style={{backgroundColor: row.original.status.color}}/>{row.original.status.name}
            {isIssueOverdue(row.original) && (
                <span role="img" aria-label="Overdue issue" title="Overdue">🔥</span>
            )}
        </span>,
    },
    {
        id: 'resolved', size: 100,
        accessorFn: (issue) => isIssueResolved(issue.status.id, issue.status.name),
        header: ({column}) => <DataTableColumnHeader column={column} title="Resolved"/>,
        cell: ({row}) => isIssueResolved(row.original.status.id, row.original.status.name)
            ? <CheckCircle2Icon className="size-4 text-emerald-600" aria-label="Resolved"/>
            : <CircleIcon className="size-4 text-muted-foreground/60" aria-label="Not resolved"/>,
    },
    {
        id: 'priority', size: 120, accessorFn: (issue) => issue.priority.name,
        header: ({column}) => <DataTableColumnHeader column={column} title="Priority"/>,
        cell: ({row}) => (
            <div className="flex w-full justify-center">
                <FlagIcon className="size-4" fill={priorityColor(row.original.priority.id)}
                          color={priorityColor(row.original.priority.id)}
                          aria-label={row.original.priority.name}/>
            </div>
        ),
    },
    {
        id: 'type', size: 140, accessorFn: (issue) => issue.issueType.name,
        header: ({column}) => <DataTableColumnHeader column={column} title="Type"/>,
        cell: ({row}) => {
            const colors = issueTypeColors(row.original.issueType.color)
            return <Badge className="w-full justify-center text-center" style={{
                backgroundColor: colors.backgroundColor,
                borderColor: colors.backgroundColor,
                color: colors.color
            }}>{row.original.issueType.name}</Badge>
        },
    },
    {
        id: 'ownership', size: 130,
        accessorFn: (issue) => `${issue.createdUser?.name ?? ''}:${issue.assignee?.name ?? ''}`,
        header: ({column}) => <DataTableColumnHeader column={column} title="Ownership"/>,
        cell: ({row}) => <IssueOwnership createdBy={row.original.createdUser} assignedTo={row.original.assignee}/>,
    },
    {
        accessorKey: 'startDate', size: 140,
        header: ({column}) => <DataTableColumnHeader column={column} title="Start date"/>,
        cell: ({row}) => <span className="whitespace-nowrap">{h_datefns_date({value: row.original.startDate})}</span>,
    },
    {
        accessorKey: 'dueDate', size: 140,
        header: ({column}) => <DataTableColumnHeader column={column} title="Due date"/>,
        cell: ({row}) => <span className="whitespace-nowrap">{h_datefns_date({value: row.original.dueDate})}</span>,
    },
    {
        accessorKey: 'estimatedHours', size: 120,
        header: ({column}) => <DataTableColumnHeader column={column} title="Estimate"/>,
        cell: ({row}) => formatHours(row.original.estimatedHours),
    },
    {
        accessorKey: 'actualHours', size: 120,
        header: ({column}) => <DataTableColumnHeader column={column} title="Actual"/>,
        cell: ({row}) => formatHours(row.original.actualHours),
    },
    {
        accessorKey: 'updated', size: 210,
        header: ({column}) => <DataTableColumnHeader column={column} title="Last updated"/>,
        cell: ({row}) => <span className="whitespace-nowrap">{h_datefns_datetime({value: row.original.updated})}</span>,
    },
]

function IssueOwnership({createdBy, assignedTo}: { createdBy: BacklogUser | null; assignedTo: BacklogUser | null }) {
    if (!createdBy && !assignedTo) return <span className="text-muted-foreground">—</span>

    const hasHandoff = Boolean(createdBy && assignedTo && createdBy.id !== assignedTo.id)
    const isSelfAssigned = Boolean(createdBy && assignedTo && createdBy.id === assignedTo.id)

    return (
        <div className="flex items-center gap-2"
             aria-label={hasHandoff ? `${createdBy?.name} assigned to ${assignedTo?.name}` : (createdBy ?? assignedTo)?.name}>
            {createdBy && <IssueUserAvatar user={createdBy} role={isSelfAssigned ? 'both' : 'creator'}/>}
            {!createdBy && assignedTo && <IssueUserAvatar user={assignedTo} role="assignee"/>}
            {hasHandoff && (
                <>
                    <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true"/>
                    <IssueUserAvatar user={assignedTo!} role="assignee"/>
                </>
            )}
        </div>
    )
}

function IssueUserAvatar({user, role}: { user: BacklogUser; role: 'creator' | 'assignee' | 'both' }) {
    const roleLabel = role === 'creator' ? 'Creator' : role === 'assignee' ? 'Assignee' : 'Creator and assignee'

    return (
        <Avatar
            size="sm"
            title={`${roleLabel}: ${user.name}`}
            className={cn(
                'ring-2 ring-offset-1 ring-offset-card',
                role === 'creator' && 'ring-sky-500',
                role === 'assignee' && 'ring-orange-500',
                role === 'both' && 'ring-sky-500 outline-2 outline-offset-2 outline-orange-500',
            )}
        >
            {user.nulabAccount?.iconUrl && <AvatarImage src={user.nulabAccount.iconUrl} alt={user.name}/>}
            <AvatarFallback>{userInitials(user.name)}</AvatarFallback>
        </Avatar>
    )
}

function userInitials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || '?'
}

function issueTypeColors(sourceColor: string): { backgroundColor: string; color: string } {
    const cached = issueTypeColorCache.get(sourceColor)
    if (cached) return cached

    const backgroundColor = h_color_adjust({
        color: sourceColor,
        strategy: 'auto',
        adjustment: 'auto',
        basisColor: '#ffffff'
    })
    const colors = {backgroundColor, color: h_color_contrast({color: backgroundColor, overrideColor: '#ffffff'})}
    issueTypeColorCache.set(sourceColor, colors)
    return colors
}

function priorityColor(priorityId: number): string {
    switch (priorityId) {
        case 2:
            return '#e8384f'
        case 3:
            return '#f9a825'
        case 4:
            return '#3b82f6'
        default:
            return 'currentColor'
    }
}

function isIssueResolved(statusId: number, statusName: string): boolean {
    return statusId === 3 || statusName.trim().toLowerCase() === 'resolved'
}

function isIssueClosed(statusId: number, statusName: string): boolean {
    return statusId === 4 || statusName.trim().toLowerCase() === 'closed'
}

function isIssueOverdue(issue: BacklogProjectIssue): boolean {
    return !isIssueClosed(issue.status.id, issue.status.name)
        && h_datefns_is_overdue({value: issue.dueDate})
}

function formatHours(value: number | null): string {
    return value === null ? '—' : `${value}h`
}
