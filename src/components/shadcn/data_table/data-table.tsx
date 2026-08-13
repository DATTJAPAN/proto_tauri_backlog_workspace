import {type CSSProperties, useEffect, useRef, useState} from 'react'
import {
    type Column,
    type ColumnDef,
    type ColumnPinningState,
    type ColumnVisibilityState,
    type PaginationState,
    type RowData,
    useTable,
} from '@tanstack/react-table'

import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from '@/components/ui/empty'
import {Skeleton} from '@/components/ui/skeleton'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {DataTableViewOptions} from './column-toggle'
import {features as dataTableFeatures, type DataTableFeatures} from './features'
import {DataTablePagination} from './pagination'
import {ScrollArea, ScrollBar} from "@/components/scroll-area.tsx";

const SKELETON_ROW_HEIGHT = 44

type DataTableProps<TData extends RowData> = {
    columns: ColumnDef<DataTableFeatures, TData, unknown>[]
    data: TData[]
    pagination: PaginationState
    onPaginationChange: (pagination: PaginationState) => void
    totalCount: number
    loading?: boolean
    emptyTitle?: string
    emptyDescription?: string
    initialColumnPinning?: ColumnPinningState
    initialColumnVisibility?: ColumnVisibilityState
    getRowId?: (row: TData) => string
}

export function DataTable<TData extends RowData>(
    {
        columns,
        data,
        pagination,
        onPaginationChange,
        totalCount,
        loading = false,
        emptyTitle = 'No data found',
        emptyDescription = 'There are no records to display.',
        initialColumnPinning = {start: [], end: []},
        initialColumnVisibility = {},
        getRowId,
    }: DataTableProps<TData>) {
    const tableViewportRef = useRef<HTMLDivElement>(null)
    const [skeletonRowCount, setSkeletonRowCount] = useState(1)
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialColumnPinning)
    const table = useTable<DataTableFeatures, TData>({
        features: dataTableFeatures,
        data,
        columns,
        defaultColumn: {enableSorting: false, minSize: 120},
        initialState: {columnVisibility: initialColumnVisibility},
        state: {pagination, columnPinning},
        onColumnPinningChange: setColumnPinning,
        manualPagination: true,
        rowCount: totalCount,
        onPaginationChange: (updater) => {
            onPaginationChange(typeof updater === 'function' ? updater(pagination) : updater)
        },
        getRowId,
    })

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => table.resetColumnSizing())
        return () => window.cancelAnimationFrame(frameId)
    }, [columnPinning, table])

    useEffect(() => {
        const viewport = tableViewportRef.current
        if (!viewport) return

        const updateSkeletonRows = () => {
            const rowsForHeight = Math.ceil(viewport.clientHeight / SKELETON_ROW_HEIGHT) + 1
            setSkeletonRowCount(Math.min(pagination.pageSize, Math.max(1, rowsForHeight)))
        }
        const resizeObserver = new ResizeObserver(updateSkeletonRows)
        resizeObserver.observe(viewport)
        updateSkeletonRows()

        return () => resizeObserver.disconnect()
    }, [pagination.pageSize])

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border bg-card">
            <div className="flex justify-end border-b px-4 py-2">
                <DataTableViewOptions table={table}/>
            </div>

            <div ref={tableViewportRef} className="flex min-h-0 flex-1">
                <ScrollArea
                    className="grid h-full w-1 flex-1 pb-1.5"
                >
                    <Table noWrapper className="min-w-full table-fixed" style={{width: table.getTotalSize()}}>
                        <TableHeader className="sticky top-0 z-10 bg-muted text-xs text-muted-foreground">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="px-4 py-2"
                                            style={pinnedColumnStyle(header.column, true)}
                                        >
                                            {header.isPlaceholder ? null : <table.FlexRender header={header}/>}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {loading && Array.from({length: skeletonRowCount}, (_, rowIndex) => (
                                <TableRow key={`skeleton-${rowIndex}`}>
                                    {table.getVisibleLeafColumns().map((column, columnIndex) => (
                                        <TableCell
                                            key={column.id}
                                            className="overflow-hidden px-4 py-3"
                                            style={pinnedColumnStyle(column)}
                                        >
                                            <Skeleton
                                                className={columnIndex === 1 ? 'h-4 w-full max-w-80' : 'h-4 w-20'}/>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {!loading && table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}
                                          style={{contentVisibility: 'auto', containIntrinsicSize: '0 44px'}}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="overflow-hidden px-4 py-3"
                                            style={pinnedColumnStyle(cell.column)}
                                        >
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
                    <ScrollBar
                        orientation="horizontal"
                        className="z-15"
                    />
                    <ScrollBar
                        orientation="vertical"
                        className="z-9"
                    />
                </ScrollArea>
            </div>

            <DataTablePagination table={table} totalCount={totalCount} visibleCount={data.length} loading={loading}/>
        </div>
    )
}

function pinnedColumnStyle<TData extends RowData>(
    column: Column<DataTableFeatures, TData, unknown>,
    isHeader = false,
): CSSProperties {
    const pinned = column.getIsPinned()
    const shadows = [
        isHeader ? 'inset 0 -1px 0 #f97316' : null,
        pinned === 'start' ? 'inset -1px 0 0 var(--border)' : null,
        pinned === 'end' ? 'inset 1px 0 0 var(--border)' : null,
    ].filter(Boolean).join(', ')

    return {
        position: pinned ? 'sticky' : 'relative',
        insetInlineStart: pinned === 'start' ? column.getStart('start') : undefined,
        insetInlineEnd: pinned === 'end' ? column.getAfter('end') : undefined,
        width: column.getSize(),
        minWidth: column.getSize(),
        maxWidth: column.getSize(),
        zIndex: pinned ? isHeader ? 3 : 2 : isHeader ? 1 : 0,
        backgroundColor: pinned ? isHeader ? '#fed7aa' : 'var(--card)' : undefined,
        color: pinned && isHeader ? '#431407' : undefined,
        boxShadow: shadows || undefined,
    }
}
