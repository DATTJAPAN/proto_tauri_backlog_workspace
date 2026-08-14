import {invoke} from '@tauri-apps/api/core'

import type {BacklogAuthentication} from './BacklogAuthentication'
import type {BacklogUser} from './BacklogUsers'

export type BacklogProjectIssueCommentChangeLog = {
    field: string;
    newValue: string | null;
    originalValue: string | null;
    attachmentInfo: Record<string, unknown> | null;
    attributeInfo: Record<string, unknown> | null;
    notificationInfo: Record<string, unknown> | null;
}

export type BacklogProjectIssueCommentNotification = {
    id: number
    alreadyRead: boolean
    reason: number
    user: BacklogUser
    resourceAlreadyRead: boolean
}

export type BacklogProjectIssueComment = {
    id: number
    projectId: number
    issueId: number
    content: string | null
    changeLog: BacklogProjectIssueCommentChangeLog[] | null | []
    createdUser: BacklogUser
    created: string
    updated: string
    stars: unknown[]
    notifications: BacklogProjectIssueCommentNotification[]
}

export type BacklogProjectIssueCommentListOptions = {
    order?: 'asc' | 'desc'
    count?: number
    minId?: number
    maxId?: number
}

export class BacklogProjectIssueComments {
    private readonly _authentication: BacklogAuthentication

    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication
    }

    public async getAll(
        issueIdOrKey: number | string,
        options: BacklogProjectIssueCommentListOptions = {},
    ): Promise<BacklogProjectIssueComment[]> {
        const connection = await this._authentication.getConnection()
        if (!connection) return []

        const queryString: [string, string][] = [
            ['_order', options.order ?? 'desc'],
            ['_count', String(Math.min(100, Math.max(1, options.count ?? 100)))],
        ]
        if (options.minId !== undefined) queryString.push(['_minId', String(options.minId)])
        if (options.maxId !== undefined) queryString.push(['_maxId', String(options.maxId)])

        return invoke<BacklogProjectIssueComment[]>('backlog_project_issue_comment_list', {
            spaceUrl: connection.spaceUrl,
            issueIdOrKey: String(issueIdOrKey),
            queryString,
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    public async getCount(issueIdOrKey: number | string): Promise<number> {
        const connection = await this._authentication.getConnection()
        if (!connection) return 0

        const result = await invoke<{ count: number }>('backlog_project_issue_comment_count', {
            spaceUrl: connection.spaceUrl,
            issueIdOrKey: String(issueIdOrKey),
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
        return result.count
    }
}
