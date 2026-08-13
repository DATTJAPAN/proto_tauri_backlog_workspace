import {type ColumnDef, type PaginationState, type RowData, useTable} from '@tanstack/react-table'

import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from '@/components/ui/empty'
import {Skeleton} from '@/components/ui/skeleton'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {DataTableViewOptions} from './column-toggle'
import {features as dataTableFeatures, type DataTableFeatures} from './features'
import {DataTablePagination} from './pagination'

type DataTableProps<TData extends RowData> = {
    columns: ColumnDef<DataTableFeatures, TData, unknown>[]
    data: TData[]
    pagination: PaginationState
    onPaginationChange: (pagination: PaginationState) => void
    totalCount: number
    loading?: boolean
    emptyTitle?: string
    emptyDescription?: string
    getRowId?: (row: TData) => string
}

export function DataTable<TData extends RowData>({
                                                     columns,
                                                     data,
                                                     pagination,
                                                     onPaginationChange,
                                                     totalCount,
                                                     loading = false,
                                                     emptyTitle = 'No data found',
                                                     emptyDescription = 'There are no records to display.',
                                                     getRowId,
                                                 }: DataTableProps<TData>) {
    const table = useTable<DataTableFeatures, TData>({
        features: dataTableFeatures,
        data,
        columns,
        state: {pagination},
        manualPagination: true,
        rowCount: totalCount,
        onPaginationChange: (updater) => {
            onPaginationChange(typeof updater === 'function' ? updater(pagination) : updater)
        },
        getRowId,
    })

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex justify-end border-b px-4 py-2">
                <DataTableViewOptions table={table}/>
            </div>
            <Table className="min-w-212.5">
                    <TableHeader className="bg-muted/50 text-xs text-muted-foreground">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="px-4 py-2">
                                    {header.isPlaceholder ? null : <table.FlexRender header={header}/>}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                    {loading && Array.from({length: pagination.pageSize}, (_, rowIndex) => (
                        <TableRow key={`skeleton-${rowIndex}`}>
                            {table.getVisibleLeafColumns().map((column, columnIndex) => (
                                <TableCell key={column.id} className="px-4 py-3">
                                    <Skeleton className={columnIndex === 1 ? 'h-4 w-full max-w-80' : 'h-4 w-20'}/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {!loading && table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="px-4 py-3">
                                    <table.FlexRender cell={cell}/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {!loading && table.getRowModel().rows.length === 0 && (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={table.getVisibleLeafColumns().length} className="p-0">
                                <Empty className="min-h-56 rounded-none border-0">
                                    <EmptyHeader>
                                        <EmptyTitle>{emptyTitle}</EmptyTitle>
                                        <EmptyDescription>{emptyDescription}</EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
            </Table>
            <DataTablePagination table={table} totalCount={totalCount} visibleCount={data.length} loading={loading}/>
        </div>
    )
}
