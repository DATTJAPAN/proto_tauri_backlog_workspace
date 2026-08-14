import {useEffect, useMemo, useState, type ComponentPropsWithoutRef} from 'react'
import {createPortal} from 'react-dom'
import {openUrl} from '@tauri-apps/plugin-opener'
import {AlertCircleIcon, ExternalLinkIcon, EyeIcon, XIcon} from 'lucide-react'

import {backlog} from '@/backlog/Backlog'
import type {BacklogProjectIssueAttachment} from '@/backlog/BacklogProjectIssues'
import {MarkdownRenderer} from '@/components/markdown-renderer'
import {Skeleton} from '@/components/ui/skeleton'

const BACKLOG_IMAGE_REFERENCE = /!\[([^\]]*)]\[([^\]]+)]/g
const ATTACHMENT_SOURCE_PREFIX = '/__backlog_attachment__/'

export function IssueMarkdown({
    issueIdOrKey,
    content,
    attachments,
    mentionNames,
    className,
}: {
    issueIdOrKey: string
    content: string
    attachments: BacklogProjectIssueAttachment[]
    mentionNames?: string[]
    className?: string
}) {
    const references = useMemo(
        () => resolveAttachmentReferences(content, attachments),
        [attachments, content],
    )
    const [attachmentSources, setAttachmentSources] = useState<Map<number, string>>(new Map())
    const [loading, setLoading] = useState(references.length > 0)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        setAttachmentSources(new Map())
        setError(null)

        if (references.length === 0) {
            setLoading(false)
            return () => { active = false }
        }

        setLoading(true)
        void Promise.all(references.map(async ({attachment}) => {
            const response = await backlog.issues.getAttachment(issueIdOrKey, attachment.id)
            return [attachment.id, `data:${response.mimeType};base64,${response.data}`] as const
        })).then((sources) => {
            if (active) setAttachmentSources(new Map(sources))
        }).catch((cause) => {
            if (active) setError(cause instanceof Error ? cause.message : String(cause))
        }).finally(() => {
            if (active) setLoading(false)
        })

        return () => { active = false }
    }, [issueIdOrKey, references])

    const markdown = useMemo(() => content.replace(
        BACKLOG_IMAGE_REFERENCE,
        (original, alt: string, filename: string) => {
            const attachment = findAttachment(filename, attachments)
            return attachment
                ? `![${escapeMarkdownLabel(alt)}](${ATTACHMENT_SOURCE_PREFIX}${attachment.id} "${escapeMarkdownTitle(attachment.name)}")`
                : original
        },
    ), [attachments, content])

    if (loading) {
        return <div className="space-y-3"><Skeleton className="h-4 w-2/3"/><Skeleton className="h-64 w-full"/></div>
    }

    return (
        <>
            {error && (
                <div role="alert" className="mb-4 flex items-start gap-2 border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                    <AlertCircleIcon className="mt-0.5 size-4 shrink-0"/>
                    <div>
                        <p className="font-medium">Unable to load an embedded attachment</p>
                        <p className="mt-1">{error}</p>
                    </div>
                </div>
            )}
            <MarkdownRenderer
                content={markdown}
                className={className}
                mentionNames={mentionNames}
                components={{
                    img: ({src, alt, ...props}) => {
                        const attachmentId = getAttachmentId(src)
                        return (
                            <AttachmentImage
                                {...props}
                                src={resolveAttachmentSource(src, attachmentSources)}
                                alt={alt ?? ''}
                                attachmentId={attachmentId}
                            />
                        )
                    },
                }}
            />
        </>
    )
}

function AttachmentImage({attachmentId, ...props}: ComponentPropsWithoutRef<'img'> & {attachmentId?: number}) {
    const [previewing, setPreviewing] = useState(false)
    const alt = getAttachmentAlt(props.alt, props.title, attachmentId)

    async function openInBacklog() {
        if (!attachmentId) return
        const connection = await backlog.getConnection()
        if (!connection) return

        const url = new URL('/ViewAttachmentImage.action', connection.spaceUrl)
        url.searchParams.set('attachmentId', String(attachmentId))
        await openUrl(url.toString())
    }

    return (
        <>
            <span className="group relative my-2 inline-block max-w-full overflow-hidden border bg-muted align-top">
                <img
                    {...props}
                    alt={alt}
                    className="block max-h-168 w-auto max-w-full object-contain"
                    loading="lazy"
                />
                <span className="absolute inset-x-0 top-0 flex justify-end gap-1 bg-gradient-to-b from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <ImageAction label="View image" onClick={() => setPreviewing(true)}>
                        <EyeIcon className="size-4"/>
                    </ImageAction>
                    {attachmentId && (
                        <ImageAction label="Open in Backlog" onClick={() => void openInBacklog()}>
                            <ExternalLinkIcon className="size-4"/>
                        </ImageAction>
                    )}
                </span>
            </span>
            {previewing && props.src && createPortal(
                <div
                    className="fixed inset-0 z-100 grid place-items-center bg-black/85 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${alt} preview`}
                    onClick={() => setPreviewing(false)}
                >
                    <div className="absolute right-4 top-4 flex gap-2">
                        {attachmentId && (
                            <ImageAction label="Open in Backlog" onClick={(event) => {
                                event.stopPropagation()
                                void openInBacklog()
                            }}>
                                <ExternalLinkIcon className="size-4"/>
                            </ImageAction>
                        )}
                        <ImageAction label="Close preview" onClick={() => setPreviewing(false)}>
                            <XIcon className="size-4"/>
                        </ImageAction>
                    </div>
                    <img
                        src={props.src}
                        alt={alt}
                        className="max-h-full max-w-full object-contain"
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>,
                document.body,
            )}
        </>
    )
}

function ImageAction({label, ...props}: ComponentPropsWithoutRef<'button'> & {label: string}) {
    return (
        <button
            {...props}
            type="button"
            aria-label={label}
            title={label}
            className="grid size-8 place-items-center rounded-sm border border-white/30 bg-black/65 text-white shadow-sm transition-colors hover:bg-black/85"
        />
    )
}

function resolveAttachmentReferences(content: string, attachments: BacklogProjectIssueAttachment[]) {
    const matches = [...content.matchAll(BACKLOG_IMAGE_REFERENCE)]
    const unique = new Map<number, BacklogProjectIssueAttachment>()
    matches.forEach((match) => {
        const attachment = findAttachment(match[2], attachments)
        if (attachment) unique.set(attachment.id, attachment)
    })
    return [...unique.values()].map((attachment) => ({attachment}))
}

function findAttachment(filename: string, attachments: BacklogProjectIssueAttachment[]) {
    const normalizedFilename = filename.trim().normalize('NFC').toLocaleLowerCase()
    return attachments.find((attachment) => (
        attachment.name.normalize('NFC').toLocaleLowerCase() === normalizedFilename
    ))
}

function resolveAttachmentSource(src: string | undefined, sources: Map<number, string>): string | undefined {
    if (!src?.startsWith(ATTACHMENT_SOURCE_PREFIX)) return src
    const attachmentId = Number(src.slice(ATTACHMENT_SOURCE_PREFIX.length))
    return sources.get(attachmentId)
}

function getAttachmentId(src: string | undefined): number | undefined {
    if (!src?.startsWith(ATTACHMENT_SOURCE_PREFIX)) return undefined
    const attachmentId = Number(src.slice(ATTACHMENT_SOURCE_PREFIX.length))
    return Number.isFinite(attachmentId) ? attachmentId : undefined
}

function getAttachmentAlt(alt: string | undefined, title: string | undefined, attachmentId?: number): string {
    const normalizedAlt = alt?.trim()
    if (normalizedAlt && normalizedAlt.toLocaleLowerCase() !== 'image') return normalizedAlt
    if (title?.trim()) return title.trim()
    return attachmentId ? `Backlog attachment ${attachmentId}` : 'Embedded image'
}

function escapeMarkdownLabel(value: string): string {
    return value.replace(/]/g, '\\]')
}

function escapeMarkdownTitle(value: string): string {
    return value.replace(/(["\\])/g, '\\$1')
}
