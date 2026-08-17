import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {invoke} from '@tauri-apps/api/core'

import type {BacklogAuthentication} from './BacklogAuthentication'
import type {BacklogProjectIssueNamedResource} from './BacklogProjectIssueNamedResource'
import {BacklogProjectStatusStruct} from './BacklogProjectStatus.ts'
import type {BacklogUser} from './BacklogUsers'
import {BacklogProjectIssueComments} from './BacklogProjectIssueComments'

export type BacklogProjectIssueTypeStruct = {
    id: number
    projectId: number
    name: string
    color: string
    displayOrder: number
}

export type BacklogProjectIssueStruct = {
    id: number
    projectId: number
    issueKey: string
    keyId: number
    summary: string
    issueType: BacklogProjectIssueTypeStruct
    description: string | null
    resolution: BacklogProjectIssueNamedResource | null
    status: BacklogProjectStatusStruct
    priority: BacklogProjectIssueNamedResource
    assignee: BacklogUser | null
    category: BacklogProjectIssueNamedResource[]
    versions: BacklogProjectIssueVersionStruct[]
    milestone: BacklogProjectIssueVersionStruct[]
    startDate: string | null
    dueDate: string | null
    estimatedHours: number | null
    actualHours: number | null
    parentIssueId: number | null
    createdUser: BacklogUser | null
    created: string
    updatedUser: BacklogUser | null
    updated: string
    customFields: unknown[]
    attachments: BacklogProjectIssueAttachment[]
    sharedFiles: unknown[]
    externalFileLinks: unknown[]
    stars: unknown[]
}

export type BacklogProjectIssueVersionStruct = {
    id: number
    projectId: number
    name: string
    description: string | null
    startDate: string | null
    releaseDueDate: string | null
    archived: boolean | null
    displayOrder: number | null
}

export type BacklogProjectIssueAttachment = {
    id: number
    name: string
    size: number
    createdUser: BacklogUser | null
    created: string | null
}

export type BacklogProjectIssueAttachmentContent = {
    data: string
    mimeType: string
}

export type BacklogIssueListOptions = {
    projectIdOrKey: string | number
    order?: 'asc' | 'desc'
    offset?: number
    count?: number
}

export type BacklogIssueCreateParam = {
    projectId: number
    summary: string
    issueTypeId: number
    priorityId: number
    parentIssueId?: number | null
    description?: string | null
    startDate?: string | null
    dueDate?: string | null
    estimatedHours?: number | null
    actualHours?: number | null
    categoryIds?: number[] | null
    'categoryId[]'?: number[] | null
    versionIds?: number[] | null
    'versionId[]'?: number[] | null
    milestoneIds?: number[] | null
    'milestoneId[]'?: number[] | null
    assigneeId?: number | null
    notifiedUserIds?: number[] | null
    'notifiedUserId[]'?: number[] | null
    attachmentIds?: number[] | null
    'attachmentId[]'?: number[] | null
}

export class BacklogIssues {
    private readonly _authentication: BacklogAuthentication
    public readonly comments: BacklogProjectIssueComments

    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication
        this.comments = new BacklogProjectIssueComments(authentication)
    }

    // --- API Methods ---

    public async get(issueIdOrKey: number | string): Promise<BacklogProjectIssueStruct> {
        const connection = await this._authentication.getConnection()
        if (!connection) throw new Error('Backlog is not connected')

        return invoke<BacklogProjectIssueStruct>('backlog_issue_get', {
            spaceUrl: connection.spaceUrl,
            issueIdOrKey: String(issueIdOrKey),
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    public async create(params: BacklogIssueCreateParam): Promise<BacklogProjectIssueStruct> {
        const connection = await this._authentication.getConnection()
        if (!connection) throw new Error('Backlog is not connected')

        const payload = {
            projectId: params.projectId,
            summary: params.summary,
            issueTypeId: params.issueTypeId,
            priorityId: params.priorityId,
            parentIssueId: params.parentIssueId ?? null,
            description: params.description ?? null,
            startDate: params.startDate ?? null,
            dueDate: params.dueDate ?? null,
            estimatedHours: params.estimatedHours ?? null,
            actualHours: params.actualHours ?? null,
            'categoryId[]': params['categoryId[]'] ?? params.categoryIds ?? null,
            'versionId[]': params['versionId[]'] ?? params.versionIds ?? null,
            'milestoneId[]': params['milestoneId[]'] ?? params.milestoneIds ?? null,
            assigneeId: params.assigneeId ?? null,
            'notifiedUserId[]': params['notifiedUserId[]'] ?? params.notifiedUserIds ?? null,
            'attachmentId[]': params['attachmentId[]'] ?? params.attachmentIds ?? null,
        }

        return invoke<BacklogProjectIssueStruct>('backlog_issue_create', {
            spaceUrl: connection.spaceUrl,
            params: payload,
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    public async getAttachment(
        issueIdOrKey: number | string,
        attachmentId: number,
    ): Promise<BacklogProjectIssueAttachmentContent> {
        const connection = await this._authentication.getConnection()
        if (!connection) throw new Error('Backlog is not connected')

        return invoke<BacklogProjectIssueAttachmentContent>('backlog_project_issue_attachment_get', {
            spaceUrl: connection.spaceUrl,
            issueIdOrKey: String(issueIdOrKey),
            attachmentId,
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    public async getAll(options: BacklogIssueListOptions): Promise<BacklogProjectIssueStruct[]> {
        const connection = await this._authentication.getConnection()
        if (!connection) return []

        const projectQueryParam = typeof options.projectIdOrKey === 'number'
            ? ['_projectId[]', String(options.projectIdOrKey)]
            : ['_projectIdOrKey[]', String(options.projectIdOrKey)]

        return invoke<BacklogProjectIssueStruct[]>('backlog_issue_list', {
            spaceUrl: connection.spaceUrl,
            queryString: [
                projectQueryParam,
                ['_order', options.order ?? 'desc'],
                ['_offset', String(options.offset ?? 0)],
                ['_count', String(options.count ?? 20)],
            ],
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    public async getCount(projectIdOrKey: string | number): Promise<number> {
        const connection = await this._authentication.getConnection()
        if (!connection) return 0

        const projectQueryParam = typeof projectIdOrKey === 'number'
            ? ['_projectId[]', String(projectIdOrKey)]
            : ['_projectIdOrKey[]', String(projectIdOrKey)]

        const result = await invoke<{ count: number }>('backlog_issue_count', {
            spaceUrl: connection.spaceUrl,
            queryString: [projectQueryParam],
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })

        return result.count
    }

    // --- React Query Hooks ---

    public useCreate() {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: (params: BacklogIssueCreateParam) => this.create(params),
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: ['backlog', 'issues'],
                })
            },
        })
    }

    public useGetAll(options: BacklogIssueListOptions) {
        const isEnabled = Boolean(options.projectIdOrKey)

        return useQuery({
            queryKey: ['backlog', 'issues', 'list', 'backlog_issue_list', options],
            queryFn: () => this.getAll(options),
            enabled: isEnabled,
        })
    }

    public useGetCount(projectIdOrKey: string | number | null) {
        const isEnabled = projectIdOrKey !== null && projectIdOrKey !== '' && projectIdOrKey !== 0

        return useQuery({
            queryKey: ['backlog', 'issues', 'count', 'backlog_issue_count', projectIdOrKey],
            queryFn: () => this.getCount(projectIdOrKey!),
            enabled: isEnabled,
        })
    }

    public useGet(issueIdOrKey: number | string) {
        return useQuery({
            queryKey: ['backlog', 'issues', 'detail', 'backlog_issue_get', issueIdOrKey],
            queryFn: () => this.get(issueIdOrKey),
            enabled: Boolean(issueIdOrKey),
        })
    }

    // TODO: useGetAttachment
}