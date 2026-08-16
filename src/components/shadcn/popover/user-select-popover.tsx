"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, SearchIcon, XIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface UserSelectOption {
    value: string
    label: string
    keyword?: string
    iconUrl?: string
}

interface UserSelectPopoverProps {
    options: UserSelectOption[]
    value?: string | null
    onValueChange: (value: string | null) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    className?: string
    maxRenderCount?: number
}

function getInitials(name?: string) {
    if (!name) return "?"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function UserSelectPopover({
                                      options = [],
                                      value = null,
                                      onValueChange,
                                      placeholder = "Select assignee...",
                                      searchPlaceholder = "Search project users...",
                                      emptyText = "No user found.",
                                      className,
                                      maxRenderCount = 50,
                                  }: UserSelectPopoverProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const selectedOption = React.useMemo(() => {
        if (!value) return null
        return options.find((opt) => opt.value === value) || null
    }, [options, value])

    // Pre-calculate lowercased search targets including Backlog keywords
    const processedOptions = React.useMemo(() => {
        return options.map((opt) => ({
            ...opt,
            initials: getInitials(opt.label),
            searchKey: `${opt.label} ${opt.keyword || ""}`.toLowerCase(),
        }))
    }, [options])

    // Perform non-sorting keyword filter capped for max performance
    const visibleOptions = React.useMemo(() => {
        if (!search.trim()) {
            return processedOptions.slice(0, maxRenderCount)
        }
        const query = search.toLowerCase().trim()

        let count = 0
        const result = []
        for (let i = 0; i < processedOptions.length; i++) {
            if (processedOptions[i].searchKey.includes(query)) {
                result.push(processedOptions[i])
                count++
                if (count >= maxRenderCount) break
            }
        }
        return result
    }, [processedOptions, search, maxRenderCount])

    const handleSelect = React.useCallback(
        (val: string) => {
            onValueChange(val)
            setOpen(false)
            setSearch("")
        },
        [onValueChange]
    )

    const handleClear = React.useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            onValueChange(null)
        },
        [onValueChange]
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className={cn("relative w-full", className)}>
                {/* Trigger Control */}
                <PopoverTrigger
                    className={cn(
                        "inline-flex h-10 w-full items-center justify-between border border-input bg-background px-3 text-xs font-normal shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50",
                        selectedOption && "pr-8"
                    )}
                >
                    {selectedOption ? (
                        <div className="flex items-center gap-2 min-w-0 truncate">
                            <Avatar className="size-5 rounded-none border shrink-0">
                                {selectedOption.iconUrl && (
                                    <AvatarImage src={selectedOption.iconUrl} alt={selectedOption.label} />
                                )}
                                <AvatarFallback className="rounded-none text-[10px]">
                                    {getInitials(selectedOption.label)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{selectedOption.label}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Avatar className="size-5 rounded-none border shrink-0">
                                <AvatarFallback className="rounded-none text-[10px]">?</AvatarFallback>
                            </Avatar>
                            <span>{placeholder}</span>
                        </div>
                    )}
                    {!selectedOption && <ChevronsUpDownIcon className="ml-2 size-3.5 shrink-0 opacity-50" />}
                </PopoverTrigger>

                {/* Inline Clear Button */}
                {selectedOption && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus:outline-none z-10"
                        onClick={handleClear}
                        title="Clear selection"
                    >
                        <XIcon className="size-3.5" />
                    </button>
                )}
            </div>

            {/* Popover Content strictly bound to trigger width */}
            <PopoverContent
                align="start"
                sideOffset={4}
                className="w-[var(--radix-popover-trigger-width,var(--anchor-width,100%))] rounded-none p-0 shadow-md border bg-popover text-popover-foreground z-50"
            >
                {/* Search Header */}
                <div className="flex items-center border-b px-3 py-2">
                    <SearchIcon className="mr-2 size-3.5 shrink-0 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-7 w-full border-none bg-transparent p-0 text-xs shadow-none focus-visible:ring-0"
                    />
                </div>

                {/* User Options List */}
                <div className="max-h-60 overflow-y-auto p-1">
                    {visibleOptions.length === 0 ? (
                        <div className="py-2.5 text-center text-xs text-muted-foreground">
                            {emptyText}
                        </div>
                    ) : (
                        visibleOptions.map((opt) => {
                            const isSelected = value === opt.value

                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt.value)}
                                    className={cn(
                                        "relative flex w-full cursor-default select-none items-center gap-2.5 rounded-none px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isSelected && "bg-accent/50 font-medium"
                                    )}
                                >
                                    <Avatar className="size-5 rounded-none border shrink-0">
                                        {opt.iconUrl && (
                                            <AvatarImage src={opt.iconUrl} alt={opt.label} />
                                        )}
                                        <AvatarFallback className="rounded-none text-[10px]">
                                            {opt.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate flex-1 text-left">{opt.label}</span>
                                    {isSelected && <CheckIcon className="size-3.5 shrink-0 text-primary" />}
                                </button>
                            )
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}