import type {Column, RowData} from '@tanstack/react-table'
import {ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EllipsisIcon, EyeOffIcon, PinIcon, PinOffIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {cn} from '@/lib/utils'
import type {DataTableFeatures} from './features'

type DataTableColumnHeaderProps<TData extends RowData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData extends RowData, TValue>({column, title, className}: DataTableColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort()
  const canPin = column.getCanPin()

  if (!canSort && !canPin && !column.getCanHide()) return <div className={cn('w-full', className)}>{title}</div>

  return (
    <div className={cn('flex min-w-0 w-full items-center', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`${title} column options`}
          render={<Button variant="ghost" size="sm" className="relative z-1 h-auto min-h-8 min-w-0 w-full justify-between gap-2 px-0 data-popup-open:bg-accent" />}
        >
          <span className="min-w-0 flex-1 whitespace-nowrap text-left" title={title}>{title}</span>
          {canSort
            ? column.getIsSorted() === 'desc' ? <ArrowDownIcon /> : column.getIsSorted() === 'asc' ? <ArrowUpIcon /> : <ChevronsUpDownIcon />
            : column.getIsPinned() ? <PinIcon /> : <EllipsisIcon />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-popover before:hidden">
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}><ArrowUpIcon /> Asc</DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}><ArrowDownIcon /> Desc</DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {canPin && (
            <>
              <DropdownMenuItem onClick={() => column.pin('start')}><PinIcon /> Pin left</DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.pin('end')}><PinIcon /> Pin right</DropdownMenuItem>
              {column.getIsPinned() && <DropdownMenuItem onClick={() => column.pin(false)}><PinOffIcon /> Unpin</DropdownMenuItem>}
            </>
          )}
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}><EyeOffIcon /> Hide</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export {DataTableColumnHeader as ColumnHeader}
