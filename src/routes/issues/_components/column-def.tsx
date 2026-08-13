import type {ColumnDef} from '@tanstack/react-table'

import type {BacklogProjectIssue} from '@/backlog/BacklogProjectIssues'
import {DataTableColumnHeader, type DataTableFeatures} from '@/components/shadcn'

export const issueColumns: ColumnDef<DataTableFeatures, BacklogProjectIssue, unknown>[] = [
    {
        accessorKey: 'issueKey',
        header: ({column}) => <DataTableColumnHeader column={column} title="Key"/>,
        cell: ({row}) => <span
            className="whitespace-nowrap font-mono text-xs font-medium">{row.original.issueKey}</span>
    },
    {
        accessorKey: 'summary',
        header: ({column}) => <DataTableColumnHeader column={column} title="Summary"/>,
        cell: ({row}) => <div className="max-w-md truncate" title={row.original.summary}>{row.original.summary}</div>
    },
    {
        id: 'type',
        accessorFn: (issue) => issue.issueType.name,
        header: ({column}) => <DataTableColumnHeader column={column} title="Type"/>,
        cell: ({row}) => <span className="whitespace-nowrap">{row.original.issueType.name}</span>
    },
    {
        id: 'status',
        accessorFn: (issue) => issue.status.name,
        header: ({column}) => <DataTableColumnHeader column={column} title="Status"/>,
        cell: ({row}) => <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><span
            className="size-2 rounded-full"
            style={{backgroundColor: row.original.status.color}}/>{row.original.status.name}</span>,
    },
    {
        id: 'priority',
        accessorFn: (issue) => issue.priority.name,
        header: ({column}) => <DataTableColumnHeader column={column} title="Priority"/>,
        cell: ({row}) => <span className="whitespace-nowrap">{row.original.priority.name}</span>
    },
    {
        id: 'assignee',
        accessorFn: (issue) => issue.assignee?.name ?? '',
        header: ({column}) => <DataTableColumnHeader column={column} title="Assignee"/>,
        cell: ({row}) => <div className="max-w-44 truncate"
                              title={row.original.assignee?.name}>{row.original.assignee?.name ?? 'Unassigned'}</div>
    },
    {
        accessorKey: 'dueDate',
        header: ({column}) => <DataTableColumnHeader column={column} title="Due date"/>,
        cell: ({row}) => <span className="whitespace-nowrap">{row.original.dueDate ?? '—'}</span>
    },
]
