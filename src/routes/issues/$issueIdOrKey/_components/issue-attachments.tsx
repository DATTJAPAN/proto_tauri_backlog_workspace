import {FileIcon, PaperclipIcon} from 'lucide-react'

import type {BacklogProjectIssueAttachment} from '@/backlog/BacklogIssues.ts'
import {ScrollArea} from '@/components/scroll-area'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

export function IssueAttachments({attachments}: {attachments: BacklogProjectIssueAttachment[]}) {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                    <PaperclipIcon className="size-4"/> Attachments
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-56">
                    <div className="divide-y pe-2.5">
                        {attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center gap-3 px-4 py-3">
                                <FileIcon className="size-4 shrink-0 text-muted-foreground"/>
                                <span className="min-w-0 flex-1 truncate" title={attachment.name}>{attachment.name}</span>
                                <span className="shrink-0 text-muted-foreground">{formatFileSize(attachment.size)}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

function formatFileSize(bytes: number): string {
    if (bytes < 1_024) return `${bytes} B`
    if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`
    return `${(bytes / 1_048_576).toFixed(1)} MB`
}
