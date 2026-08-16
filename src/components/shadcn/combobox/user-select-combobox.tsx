"use client"

import * as React from "react"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {cn} from "@/lib/utils"

export interface UserSelectOption {
    value: string
    label: string
    keyword?: string
    iconUrl?: string
}

interface UserSelectComboboxProps {
    options: UserSelectOption[]
    value?: string | null
    onValueChange: (value: string | null) => void
    searchPlaceholder?: string
    emptyText?: string
    className?: string
}

function getInitials(name?: string) {
    if (!name) return "?"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function UserSelectCombobox(
    {
        options = [],
        value = null,
        onValueChange,
        searchPlaceholder = "Search project users...",
        emptyText = "No user found.",
        className,
    }: UserSelectComboboxProps) {
    const selectedOption = React.useMemo(() => {
        if (!value) return null
        return options.find((opt) => opt.value === value) || null
    }, [options, value])

    return (
        <Combobox
            items={options}
            value={selectedOption}
            onValueChange={(newOption) => {
                onValueChange(newOption ? newOption.value : null)
            }}
            getItemValue={(item) => item.value}
            getItemLabel={(item) => item.label}
            filter={(item, query) => {
                if (!query.trim()) return true
                const q = query.toLowerCase()
                const labelMatch = item.label.toLowerCase().includes(q)
                const keywordMatch = item.keyword ? item.keyword.toLowerCase().includes(q) : false
                return labelMatch || keywordMatch
            }}
        >
            <div className={cn("w-full", className)}>
                {/* Input Container - ComboboxInput fills 100% full width naturally */}
                <div className="relative w-full">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <Avatar className="size-5 rounded-none border shrink-0">
                            {selectedOption?.iconUrl && (
                                <AvatarImage src={selectedOption.iconUrl} alt={selectedOption.label}/>
                            )}
                            <AvatarFallback className="rounded-none text-[10px]">
                                {selectedOption ? getInitials(selectedOption.label) : "?"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <ComboboxInput
                        placeholder={searchPlaceholder}
                        showClear
                        className="h-10 w-full rounded-none border border-input bg-background text-xs font-normal shadow-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <ComboboxContent
                    align="start"
                    className="rounded-none p-1 z-50 bg-popover text-popover-foreground shadow-md"
                >
                    <ComboboxEmpty className="py-2.5 text-center text-xs text-muted-foreground">
                        {emptyText}
                    </ComboboxEmpty>

                    <ComboboxList className="max-h-60 overflow-y-auto">
                        {(item: UserSelectOption) => (
                            <ComboboxItem
                                key={item.value}
                                value={item}
                                className="relative flex w-full cursor-default select-none items-center gap-2.5 rounded-none py-1.5 pl-2 pr-8 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            >
                                <Avatar className="size-5 rounded-none border shrink-0">
                                    {item.iconUrl && (
                                        <AvatarImage src={item.iconUrl} alt={item.label}/>
                                    )}
                                    <AvatarFallback className="rounded-none text-[10px]">
                                        {getInitials(item.label)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate flex-1">{item.label}</span>
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </div>
        </Combobox>
    )
}