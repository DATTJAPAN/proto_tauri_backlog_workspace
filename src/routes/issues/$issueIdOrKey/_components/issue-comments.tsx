import {useEffect, useMemo, useState} from 'react'
import {
    ActivityIcon,
    AlertCircleIcon,
    ArrowRight,
    BellIcon,
    CalendarIcon,
    FileTextIcon,
    MessageSquareIcon,
    PaperclipIcon,
    TagIcon,
    UserCheckIcon,
} from 'lucide-react'

import {backlog} from '@/backlog/Backlog'
import type {BacklogProjectIssueComment} from '@/backlog/BacklogProjectIssueComments'
import type {BacklogProjectIssueAttachment} from '@/backlog/BacklogIssues.ts'
import type {BacklogUser} from '@/backlog/BacklogUsers'
import {Avatar, AvatarFallback, AvatarGroup, AvatarImage} from '@/components/ui/avatar'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Skeleton} from '@/components/ui/skeleton'
import {h_datefns_datetime} from '@/helper/datefns'
import {cn} from '@/lib/utils'
import {IssueMarkdown} from './issue-markdown'
import {h_array_length} from "@/helper/array.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";

const COMMENT_LIMIT = 50

export interface IssueCommentsProps {
    issueIdOrKey: string
    attachments: BacklogProjectIssueAttachment[]
    mentionNames?: string[]
}

export interface IssueCommentProps {
    comment: BacklogProjectIssueComment
    issueIdOrKey: string
    attachments: BacklogProjectIssueAttachment[]
    mentionNames?: string[]
    isMine: boolean
}

export function IssueComments(
    {
        issueIdOrKey,
        attachments,
        mentionNames = [],
    }: IssueCommentsProps) {
    const [comments, setComments] = useState<BacklogProjectIssueComment[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [currentUserId, setCurrentUserId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(null)

        void Promise.all([
            backlog.issues.comments.getAll(issueIdOrKey, {order: 'desc', count: COMMENT_LIMIT}),
            backlog.issues.comments.getCount(issueIdOrKey),
            backlog.users.getCurrent().catch(() => null),
        ]).then(([nextComments, nextCount, currentUser]) => {
            if (!active) return
            setComments(nextComments.reverse())
            setTotalCount(nextCount)
            setCurrentUserId(currentUser?.id ?? null)
        }).catch((cause) => {
            if (!active) return
            setError(cause instanceof Error ? cause.message : String(cause))
        }).finally(() => {
            if (active) setLoading(false)
        })

        return () => {
            active = false
        }
    }, [issueIdOrKey])

    const loadMore = () => {
        const oldestId = comments[0]?.id
        if (oldestId === undefined || loadingMore) return

        setLoadingMore(true)
        setError(null)

        void backlog.issues.comments.getAll(issueIdOrKey, {
            order: 'desc',
            count: COMMENT_LIMIT,
            maxId: oldestId,
        }).then((olderComments) => {
            setComments((current) => {
                const loadedIds = new Set(current.map((comment) => comment.id))
                const newComments = olderComments.filter((comment) => !loadedIds.has(comment.id))
                return [...newComments.reverse(), ...current]
            })
        }).catch((cause) => {
            setError(cause instanceof Error ? cause.message : String(cause))
        }).finally(() => {
            setLoadingMore(false)
        })
    }

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                    <MessageSquareIcon className="size-4"/>
                    Comments
                    {!loading && <span className="text-muted-foreground">({totalCount})</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-4 p-4 pe-6">
                    {loading && <CommentSkeleton/>}
                    {!loading && error && (
                        <div role="alert"
                             className="flex items-start gap-2 border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                            <AlertCircleIcon className="mt-0.5 size-4 shrink-0"/>
                            <div><p className="font-medium">Unable to load comments</p><p
                                className="mt-1">{error}</p></div>
                        </div>
                    )}
                    {!loading && !error && comments.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">No comments yet.</p>
                    )}
                    {!loading && !error && totalCount > comments.length && (
                        <button
                            type="button"
                            className="block w-full border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-60"
                            onClick={loadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore
                                ? 'Loading more comments…'
                                : `Show more comments (showing ${comments.length} of ${totalCount})`}
                        </button>
                    )}
                    {!loading && !error && comments.map((comment) => (
                        <IssueComment
                            key={comment.id}
                            comment={comment}
                            issueIdOrKey={issueIdOrKey}
                            attachments={attachments}
                            mentionNames={mentionNames}
                            isMine={comment.createdUser.id === currentUserId}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function IssueComment(
    {
        comment,
        issueIdOrKey,
        attachments,
        mentionNames = [],
        isMine,
    }: IssueCommentProps) {
    const mentionUsers = useMemo(() => {
        const users = new Map<number, BacklogUser>()
        comment.notifications.forEach((notification) => users.set(notification.user.id, notification.user))
        return [...users.values()]
    }, [comment.notifications])

    const combinedMentionNames = useMemo(() => {
        const names = new Set<string>([...mentionNames])
        mentionUsers.forEach((user) => {
            if (user.name) names.add(user.name)
        })
        return [...names]
    }, [mentionNames, mentionUsers])

    const hasChangeLog = useMemo(() => {
        const len = h_array_length(comment?.changeLog)
        return len !== null && len > 0
    }, [comment?.changeLog])

    const hasContent = useMemo(() => {
        return Boolean(comment.content?.trim())
    }, [comment.content])

    const __renderChangeLog = (comment: BacklogProjectIssueComment) => {
        if (!hasChangeLog) {
            return null
        }

        const getFieldIcon = (field: string) => {
            switch (field) {
                case 'status':
                    return <ActivityIcon className="size-3.5 text-blue-500 shrink-0"/>
                case 'attachment':
                    return <PaperclipIcon className="size-3.5 text-amber-500 shrink-0"/>
                case 'assigner':
                    return <UserCheckIcon className="size-3.5 text-emerald-500 shrink-0"/>
                case 'startDate':
                case 'limitDate':
                    return <CalendarIcon className="size-3.5 text-purple-500 shrink-0"/>
                case 'notification':
                    return <BellIcon className="size-3.5 text-rose-500 shrink-0"/>
                case 'description':
                    return <FileTextIcon className="size-3.5 text-slate-500 shrink-0"/>
                default:
                    return <TagIcon className="size-3.5 text-muted-foreground shrink-0"/>
            }
        }

        const getFieldLabel = (field: string): string => {
            const labels: Record<string, string> = {
                status: 'Status',
                assigner: 'Assignee',
                attachment: 'Attachment',
                startDate: 'Start Date',
                limitDate: 'Due Date',
                description: 'Description',
                component: 'Component',
                notification: 'Notification',
            }
            return labels[field] || field
        }

        // Notification type formatter
        const formatNotificationType = (type?: string): string => {
            if (!type) return 'System Event'

            const knownTypes: Record<string, string> = {
                'issue.create': 'Issue Created',
                'issue.update': 'Issue Updated',
                'issue.comment': 'Comment Added',
                'issue.delete': 'Issue Deleted',
            }

            if (knownTypes[type]) {
                return knownTypes[type]
            }

            return type
                .split(/[._-]/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
        }

        return (
            <>
                <div className="flex flex-col gap-1.5 my-2">
                    {comment.changeLog?.map((log, index) => {
                        const icon = getFieldIcon(log.field)
                        const label = getFieldLabel(log.field)

                        // 1. ATTACHMENT LOGS
                        if (log.field === 'attachment' || log.attachmentInfo) {
                            const fileName = log.attachmentInfo?.name || log.newValue || log.originalValue
                            return (
                                <div key={index}
                                     className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                    {icon}
                                    <span>Added attachment:</span>
                                    <Badge variant="outline" className="font-mono text-xs bg-muted/30 px-2 py-0.5">
                                        {fileName}
                                    </Badge>
                                </div>
                            )
                        }

                        // 2. NOTIFICATION LOGS
                        if (log.field === 'notification' || log.notificationInfo) {
                            const formattedNotif = formatNotificationType(log.notificationInfo?.type)
                            return (
                                <div key={index}
                                     className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                    {icon}
                                    <span>Triggered notification:</span>
                                    <Badge variant="secondary" className="font-medium text-xs px-2 py-0.5">
                                        {formattedNotif}
                                    </Badge>
                                </div>
                            )
                        }

                        // 3. DESCRIPTION / LONG TEXT UPDATES
                        if (log.field === 'description') {
                            return (
                                <div key={index}
                                     className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                    {icon}
                                    <span>Updated <strong>Description</strong></span>
                                </div>
                            )
                        }

                        // 4. STANDARD VALUE TRANSITIONS (Status, Assignee, Dates, Components, etc.)
                        return (
                            <div key={index}
                                 className="inline-flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                {icon}
                                <span>Changed {label}:</span>

                                {log.originalValue ? (
                                    <Badge
                                        variant="outline"
                                        className="font-normal text-muted-foreground/80 line-through bg-muted/40 text-xs px-2 py-0.5"
                                    >
                                        {log.originalValue}
                                    </Badge>
                                ) : (
                                    <span className="italic text-muted-foreground/60 text-xs">None</span>
                                )}

                                <ArrowRight className="size-3 text-muted-foreground/60 shrink-0"/>

                                {log.newValue ? (
                                    <Badge variant="secondary" className="font-medium text-xs px-2 py-0.5">
                                        {log.newValue}
                                    </Badge>
                                ) : (
                                    <span className="italic text-muted-foreground/60 text-xs">Cleared</span>
                                )}
                            </div>
                        )
                    })}
                </div>
                {hasContent && <Separator className="my-2.5"/>}
            </>
        )
    }

    return (
        <article
            id={`comment-${comment.id}`}
            className={cn(
                'w-[97%] border bg-background',
                isMine
                    ? 'ms-auto border-orange-300 bg-orange-50/60 dark:border-orange-800 dark:bg-orange-950/25'
                    : 'me-auto',
            )}
        >
            <header className={cn(
                'flex items-center gap-2.5 border-b bg-muted/30 px-3 py-2',
                isMine && 'flex-row-reverse border-orange-200 bg-orange-100/60 dark:border-orange-900 dark:bg-orange-950/40',
            )}>
                <UserAvatar user={comment.createdUser}/>
                <div className={cn('min-w-0 flex-1', isMine && 'text-end')}>
                    <p className="truncate text-xs font-semibold" title={comment.createdUser.name}>
                        {comment.createdUser.name}{isMine && ' (You)'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        {h_datefns_datetime({value: comment.created})}
                        {comment.updated !== comment.created && ' · edited'}
                    </p>
                </div>
                {mentionUsers.length > 0 && (
                    <div className="flex items-center gap-2" title={`${mentionUsers.length} notified`}>
                        <BellIcon className="size-3.5 text-muted-foreground"/>
                        <AvatarGroup>
                            {mentionUsers.slice(0, 4).map((user) => <UserAvatar key={user.id} user={user}/>)}
                        </AvatarGroup>
                    </div>
                )}
            </header>
            <div className="px-3 py-2.5">
                {__renderChangeLog(comment)}

                {hasContent ? (
                    <IssueMarkdown
                        issueIdOrKey={issueIdOrKey}
                        content={comment.content!}
                        attachments={attachments}
                        mentionNames={combinedMentionNames}
                        className="typeset-issue typeset-compact"
                    />
                ) : !hasChangeLog ? (
                    <p className="text-xs italic text-muted-foreground">No comment text.</p>
                ) : null}
            </div>
        </article>
    )
}

function UserAvatar({user}: { user: BacklogUser }) {
    return (
        <Avatar size="sm" title={user.name}>
            {user.nulabAccount?.iconUrl && <AvatarImage src={user.nulabAccount.iconUrl} alt={user.name}/>}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
    )
}

function CommentSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({length: 3}, (_, index) => (
                <div key={index} className="border p-4">
                    <div className="mb-4 flex items-center gap-3">
                        <Skeleton className="size-6 rounded-full"/>
                        <Skeleton className="h-3 w-36"/>
                    </div>
                    <Skeleton className="mb-2 h-3 w-full"/>
                    <Skeleton className="h-3 w-2/3"/>
                </div>
            ))}
        </div>
    )
}

function initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}