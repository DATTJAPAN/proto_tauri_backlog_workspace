import * as React from "react"

import {Calendar} from "@/components/ui/calendar"
import {
    SidebarGroup,
    SidebarGroupContent,
} from "@/components/ui/sidebar"

export function DatePicker() {
    const [date, setDate] = React.useState<Date | undefined>(() => new Date())

    React.useEffect(() => {
        let timeoutId: number

        const selectTodayAtNextMidnight = () => {
            const now = new Date()
            const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

            timeoutId = window.setTimeout(() => {
                setDate(new Date())
                selectTodayAtNextMidnight()
            }, nextMidnight.getTime() - now.getTime() + 100)
        }

        selectTodayAtNextMidnight()
        return () => window.clearTimeout(timeoutId)
    }, [])

    return (
        <SidebarGroup className="px-0">
            <SidebarGroupContent>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                    className="bg-transparent [--cell-size:2.1rem]"
                />
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
