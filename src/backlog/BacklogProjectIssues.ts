import {invoke} from '@tauri-apps/api/core'

import type {BacklogAuthentication} from './BacklogAuthentication'

type NamedResource = {id: number; name: string}

export type BacklogProjectIssue = {
  id: number
  projectId: number
  issueKey: string
  summary: string
  issueType: NamedResource & {color: string}
  status: NamedResource & {color: string}
  priority: NamedResource
  assignee: {id: number; name: string} | null
  dueDate: string | null
  updated: string
}

export type BacklogIssueListOptions = {
  projectId: number
  order?: 'asc' | 'desc'
  offset?: number
  count?: number
}

export class BacklogProjectIssues {
  private readonly _authentication: BacklogAuthentication

  public constructor(authentication: BacklogAuthentication) {
    this._authentication = authentication
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
