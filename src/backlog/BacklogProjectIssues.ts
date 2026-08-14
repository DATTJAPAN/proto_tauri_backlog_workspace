import {invoke} from '@tauri-apps/api/core'

import type {BacklogAuthentication} from './BacklogAuthentication'
import type {BacklogProjectIssueNamedResource} from './BacklogProjectIssueNamedResource'
import type {BacklogProjectStatus} from './BacklogProjectStatus'
import type {BacklogUser} from './BacklogUsers'
import {BacklogProjectIssueComments} from './BacklogProjectIssueComments'

export type BacklogProjectIssueType = {
  id: number
  projectId: number
  name: string
  color: string
  displayOrder: number
}

export type BacklogProjectIssue = {
  id: number
  projectId: number
  issueKey: string
  keyId: number
  summary: string
  issueType: BacklogProjectIssueType
  description: string | null
  resolution: BacklogProjectIssueNamedResource | null
  status: BacklogProjectStatus
  priority: BacklogProjectIssueNamedResource
  assignee: BacklogUser | null
  category: BacklogProjectIssueNamedResource[]
  versions: BacklogProjectIssueVersion[]
  milestone: BacklogProjectIssueVersion[]
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

export type BacklogProjectIssueVersion = {
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
  projectId: number
  order?: 'asc' | 'desc'
  offset?: number
  count?: number
}

export class BacklogProjectIssues {
  private readonly _authentication: BacklogAuthentication
  public readonly comments: BacklogProjectIssueComments

  public constructor(authentication: BacklogAuthentication) {
    this._authentication = authentication
    this.comments = new BacklogProjectIssueComments(authentication)
  }

  public async get(issueIdOrKey: number | string): Promise<BacklogProjectIssue> {
    const connection = await this._authentication.getConnection()
    if (!connection) throw new Error('Backlog is not connected')

    return invoke<BacklogProjectIssue>('backlog_project_issue_get', {
      spaceUrl: connection.spaceUrl,
      issueIdOrKey: String(issueIdOrKey),
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

  public async getAll(options: BacklogIssueListOptions): Promise<BacklogProjectIssue[]> {
    const connection = await this._authentication.getConnection()
    if (!connection) return []

    return invoke<BacklogProjectIssue[]>('backlog_project_issue_list', {
      spaceUrl: connection.spaceUrl,
      queryString: [
        ['_projectId[]', String(options.projectId)],
        ['_order', options.order ?? 'desc'],
        ['_offset', String(options.offset ?? 0)],
        ['_count', String(options.count ?? 20)],
      ],
      apiKey: connection.method === 'api-key' ? connection.apiKey : null,
      accessToken: connection.method === 'oauth' ? connection.accessToken : null,
    })
  }

  public async getCount(projectId: number): Promise<number> {
    const connection = await this._authentication.getConnection()
    if (!connection) return 0

    const result = await invoke<{count: number}>('backlog_project_issue_count', {
      spaceUrl: connection.spaceUrl,
      queryString: [['_projectId[]', String(projectId)]],
      apiKey: connection.method === 'api-key' ? connection.apiKey : null,
      accessToken: connection.method === 'oauth' ? connection.accessToken : null,
    })

    return result.count
  }
}
