import type {ReactTable, RowData} from '@tanstack/react-table'
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react'

import {NativeSelect, NativeSelectOption} from '@/components/native-select'
import {Button} from '@/components/ui/button'
import {Spinner} from '@/components/ui/spinner'
import type {DataTableFeatures} from './features'

type DataTablePaginationProps<TData extends RowData> = {
    table: ReactTable<DataTableFeatures, TData>
    totalCount: number
    visibleCount: number
    loading?: boolean
}

export function DataTablePagination<TData extends RowData>(
    {
        table,
        totalCount,
        visibleCount,
        loading = false
    }: DataTablePaginationProps<TData>) {
    const {pageIndex, pageSize} = table.state.pagination
    const firstRow = visibleCount === 0 ? 0 : pageIndex * pageSize + 1
    const lastRow = pageIndex * pageSize + visibleCount

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                Showing {firstRow}–{lastRow} of {totalCount}
                {loading && <Spinner className="size-3.5"/>}
            </span>
            <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Rows per page
                    <NativeSelect
                        size="sm"
                        value={String(pageSize)}
                        disabled={loading}
                        onChange={(event) => table.setPageSize(Number(event.target.value))}
                    >
                        {[20, 50, 100].map((size) => (
                            <NativeSelectOption key={size} value={String(size)}>{size}</NativeSelectOption>
                        ))}
                    </NativeSelect>
                </label>
                <span className="mr-2 hidden text-xs text-muted-foreground sm:inline">
          Page {totalCount === 0 ? 0 : pageIndex + 1} of {table.getPageCount()}
        </span>
                <Button variant="outline" size="sm" disabled={loading || !table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}>
                    <ChevronLeftIcon/> Previous
                </Button>
                <Button variant="outline" size="sm" disabled={loading || !table.getCanNextPage()}
                        onClick={() => table.nextPage()}>
                    Next <ChevronRightIcon/>
                </Button>
            </div>
        </div>
    )
}
