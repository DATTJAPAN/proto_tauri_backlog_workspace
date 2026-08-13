import type {Column, RowData} from '@tanstack/react-table'
import {ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EyeOffIcon} from 'lucide-react'

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
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="-ml-2 h-8 data-[popup-open]:bg-accent" />}>
          <span>{title}</span>
          {column.getIsSorted() === 'desc' ? <ArrowDownIcon /> : column.getIsSorted() === 'asc' ? <ArrowUpIcon /> : <ChevronsUpDownIcon />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}><ArrowUpIcon /> Asc</DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}><ArrowDownIcon /> Desc</DropdownMenuItem>
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
