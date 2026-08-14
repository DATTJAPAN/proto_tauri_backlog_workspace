import {
    isValidElement,
    lazy,
    memo,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
} from 'react'
import ReactMarkdown, {type Components} from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkEmoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import type {Link, Parent, PhrasingContent, Root, Text} from 'mdast'
import type {PluggableList, Plugin} from 'unified'
import {CheckIcon, CopyIcon, DownloadIcon, ExternalLinkIcon, LinkIcon} from 'lucide-react'
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'

import {cn} from '@/lib/utils'

const SyntaxHighlighter = lazy(() =>
    import('react-syntax-highlighter').then(({Prism}) => ({default: Prism})),
)

const DOWNLOAD_EXTENSION = /\.(?:pdf|docx?|zip|rar|tar|gz)(?:[?#].*)?$/i
const LANGUAGE_CLASS = /(?:^|\s)language-([\w-]+)/i

export type MarkdownLinkTarget = '_blank' | '_self' | '_parent' | '_top'
export type MarkdownSyntaxTheme = Record<string, CSSProperties>

export interface MarkdownRendererFeatures {
    gfm?: boolean
    math?: boolean
    emoji?: boolean
    rawHtml?: boolean
    headingIds?: boolean
    mermaid?: boolean
    mentions?: boolean
}

export interface MarkdownCodeOptions {
    showCopyButton?: boolean
    showLineNumbers?: boolean
    theme?: MarkdownSyntaxTheme
}

export interface MarkdownRendererProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
    content: string
    components?: Components
    features?: MarkdownRendererFeatures
    code?: MarkdownCodeOptions
    linkTarget?: MarkdownLinkTarget
    remarkPlugins?: PluggableList
    rehypePlugins?: PluggableList
    renderMermaid?: (source: string) => ReactNode
    mentionNames?: string[]
    resolveMentionHref?: (name: string) => string | undefined
    onMentionClick?: (name: string, event: MouseEvent<HTMLAnchorElement>) => void
    onLinkClick?: (url: string, event: MouseEvent<HTMLAnchorElement>) => void
    onDownloadClick?: (url: string, filename: string, event: MouseEvent<HTMLAnchorElement>) => void
}

const DEFAULT_FEATURES: Required<MarkdownRendererFeatures> = {
    gfm: true,
    math: true,
    emoji: true,
    rawHtml: false,
    headingIds: true,
    mermaid: false,
    mentions: true,
}

const DEFAULT_CODE_OPTIONS: Required<MarkdownCodeOptions> = {
    showCopyButton: true,
    showLineNumbers: false,
    theme: vscDarkPlus,
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
                                                                   content,
                                                                   components,
                                                                   features,
                                                                   code,
                                                                   linkTarget = '_blank',
                                                                   remarkPlugins: additionalRemarkPlugins = [],
                                                                   rehypePlugins: additionalRehypePlugins = [],
                                                                   renderMermaid,
                                                                   mentionNames = [],
                                                                   resolveMentionHref,
                                                                   onMentionClick,
                                                                   onLinkClick,
                                                                   onDownloadClick,
                                                                   className,
                                                                   ...containerProps
                                                               }: MarkdownRendererProps) {
    const enabledFeatures = {...DEFAULT_FEATURES, ...features}
    const codeOptions = {...DEFAULT_CODE_OPTIONS, ...code}

    const remarkPlugins = useMemo<PluggableList>(() => {
        const plugins: PluggableList = []
        if (enabledFeatures.gfm) plugins.push(remarkGfm)
        if (enabledFeatures.math) plugins.push(remarkMath)
        if (enabledFeatures.emoji) plugins.push([remarkEmoji, {padSpaceAfter: true}])
        if (enabledFeatures.mentions) {
            plugins.push([remarkMentions, {names: mentionNames, resolveHref: resolveMentionHref}])
        }
        return [...plugins, ...additionalRemarkPlugins]
    }, [
        additionalRemarkPlugins,
        enabledFeatures.emoji,
        enabledFeatures.gfm,
        enabledFeatures.math,
        enabledFeatures.mentions,
        mentionNames,
        resolveMentionHref,
    ])

    const rehypePlugins = useMemo<PluggableList>(() => {
        const plugins: PluggableList = []
        if (enabledFeatures.rawHtml) plugins.push(rehypeRaw)
        if (enabledFeatures.headingIds) plugins.push(rehypeSlug)
        if (enabledFeatures.math) plugins.push(rehypeKatex)
        return [...plugins, ...additionalRehypePlugins]
    }, [enabledFeatures.headingIds, enabledFeatures.math, enabledFeatures.rawHtml, additionalRehypePlugins])

    const markdownComponents = useMemo<Components>(() => ({
        pre: ({children}) => {
            const codeElement = Array.isArray(children) ? children[0] : children
            if (!isValidElement(codeElement)) return <pre>{children}</pre>

            const codeProps = (codeElement as ReactElement<{
                className?: string
                children?: ReactNode
            }>).props
            const language = LANGUAGE_CLASS.exec(codeProps.className ?? '')?.[1] ?? 'text'
            const source = getTextContent(codeProps.children).replace(/\n$/, '')

            if (language.toLowerCase() === 'mermaid' && enabledFeatures.mermaid && renderMermaid) {
                return <>{renderMermaid(source)}</>
            }

            return (
                <MarkdownCodeBlock
                    source={source}
                    language={language}
                    options={codeOptions}
                />
            )
        },
        code: ({className: codeClassName, children, ...props}) => (
            <code className={codeClassName} {...props}>{children}</code>
        ),
        a: ({href = '', children, ...props}) => {
            const mentionName = (props as { 'data-mention'?: unknown })['data-mention']
            const isMention = typeof mentionName === 'string'
            const isDownload = DOWNLOAD_EXTENSION.test(href)
            const isExternal = /^(?:https?:)?\/\//i.test(href)
            const isAnchor = href.startsWith('#')
            const target = isAnchor ? '_self' : isExternal ? '_blank' : linkTarget

            const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
                if (isMention) {
                    if (href === '#') event.preventDefault()
                    onMentionClick?.(mentionName, event)
                } else if (isDownload && onDownloadClick) {
                    event.preventDefault()
                    onDownloadClick(href, getFilename(href), event)
                } else if (isAnchor) {
                    scrollToAnchor(href, event)
                }
                onLinkClick?.(href, event)
            }

            return (
                <a
                    href={href}
                    target={target}
                    rel={target === '_blank' ? 'noreferrer noopener' : undefined}
                    onClick={handleClick}
                    title={isMention ? `Mention: @${mentionName}` : undefined}
                    {...props}
                >
                    {children}

                    {isDownload && <DownloadIcon className="size-4" data-icon="inline-end" aria-hidden="true"/>}
                    {!isDownload && isExternal &&
                        <ExternalLinkIcon className="size-4" data-icon="inline-end" aria-hidden="true"/>}
                    {isAnchor && !isMention && <LinkIcon className="size-4" data-icon="inline-end" aria-hidden="true"/>}


                </a>
            )
        },
        table: ({children, ...props}) => (
            <div className="typeset-scroll">
                <table {...props}>{children}</table>
            </div>
        ),
        ...components,
    }), [
        codeOptions,
        components,
        enabledFeatures.mermaid,
        linkTarget,
        onDownloadClick,
        onLinkClick,
        onMentionClick,
        renderMermaid,
    ])

    return (
        <div
            {...containerProps}
            className={cn('typeset typeset-docs typeset-jetbrains-mono max-w-none', className)}
        >
            <ReactMarkdown
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={markdownComponents}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
})

type RemarkMentionOptions = {
    names?: string[]
    resolveHref?: (name: string) => string | undefined
}

const remarkMentions: Plugin<[RemarkMentionOptions?], Root> = (options = {}) => (tree) => {
    transformMentionChildren(tree, options)
}

function transformMentionChildren(parent: Parent, options: RemarkMentionOptions) {
    parent.children = parent.children.flatMap<(typeof parent.children)[number]>((child) => {
        if (child.type === 'link' || child.type === 'linkReference' || child.type === 'code' || child.type === 'inlineCode') {
            return child
        }

        if (child.type === 'text') {
            return parseMentionText(child, options) as (typeof parent.children)[number][]
        }
        if ('children' in child) transformMentionChildren(child as Parent, options)
        return child
    })
}

function parseMentionText(node: Text, options: RemarkMentionOptions): PhrasingContent[] {
    const result: PhrasingContent[] = []
    const lines = node.value.split(/(\r?\n)/)

    for (const line of lines) {
        if (/^\r?\n$/.test(line)) {
            result.push({type: 'text', value: line})
            continue
        }

        const standaloneMentionLine = /^\s*@/.test(line)
        const knownNames = [...new Set(options.names ?? [])]
            .filter(Boolean)
            .sort((left, right) => right.length - left.length)
            .map(escapeRegularExpression)
        const pattern = standaloneMentionLine
            ? /@([^@\r\n]+?)(?=\s+@|\s*$)/g
            : new RegExp(`@(?:${knownNames.length > 0 ? `${knownNames.join('|')}|` : ''}[\\p{L}\\p{N}._-]+)`, 'gu')
        let cursor = 0

        for (const match of line.matchAll(pattern)) {
            const start = match.index
            if (start > cursor) result.push({type: 'text', value: line.slice(cursor, start)})

            const label = match[0].trimEnd()
            const name = standaloneMentionLine ? match[1].trim() : label.slice(1)
            result.push(createMentionLink(name, label, options))
            cursor = start + label.length
        }

        if (cursor < line.length) result.push({type: 'text', value: line.slice(cursor)})
    }

    return result.length > 0 ? result : [node]
}

function escapeRegularExpression(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function createMentionLink(name: string, label: string, options: RemarkMentionOptions): Link {
    return {
        type: 'link',
        url: options.resolveHref?.(name) ?? '#',
        title: `Mention: @${name}`,
        children: [{type: 'text', value: label}],
        data: {hProperties: {'data-mention': name}},
    }
}

function MarkdownCodeBlock({
                               source,
                               language,
                               options,
                           }: {
    source: string
    language: string
    options: Required<MarkdownCodeOptions>
}) {
    const [copied, setCopied] = useState(false)
    const resetTimer = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(resetTimer.current), [])

    async function copySource() {
        await navigator.clipboard.writeText(source)
        setCopied(true)
        window.clearTimeout(resetTimer.current)
        resetTimer.current = window.setTimeout(() => setCopied(false), 2_000)
    }

    return (
        <div className="not-typeset my-5 overflow-hidden border bg-card text-card-foreground">
            <div className="flex h-9 items-center justify-between border-b bg-muted px-3 text-xs">
                <span className="font-medium uppercase text-muted-foreground">{language}</span>
                {options.showCopyButton && (
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => void copySource()}
                        aria-label={copied ? 'Code copied' : 'Copy code'}
                    >
                        {copied ? <CheckIcon className="size-3.5"/> : <CopyIcon className="size-3.5"/>}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                )}
            </div>
            <Suspense fallback={<pre className="overflow-x-auto p-4 text-sm"><code>{source}</code></pre>}>
                <SyntaxHighlighter
                    language={language}
                    style={options.theme}
                    showLineNumbers={options.showLineNumbers}
                    wrapLongLines={false}
                    customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        padding: '1rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                    }}
                    codeTagProps={{style: {fontFamily: 'inherit'}}}
                >
                    {source}
                </SyntaxHighlighter>
            </Suspense>
        </div>
    )
}

function getTextContent(value: ReactNode): string {
    if (typeof value === 'string' || typeof value === 'number') return String(value)
    if (Array.isArray(value)) return value.map(getTextContent).join('')
    if (isValidElement(value)) {
        return getTextContent((value as ReactElement<{ children?: ReactNode }>).props.children)
    }
    return ''
}

function getFilename(url: string): string {
    const pathname = url.split(/[?#]/, 1)[0]
    const filename = pathname.split('/').pop()
    return filename ? decodeURIComponent(filename) : 'download'
}

function scrollToAnchor(href: string, event: MouseEvent<HTMLAnchorElement>) {
    const id = decodeURIComponent(href.slice(1))
    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    target.scrollIntoView({behavior: 'smooth', block: 'start'})
    window.history.replaceState(null, '', href)
}

export default MarkdownRenderer
