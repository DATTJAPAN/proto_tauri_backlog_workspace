import {useQuery} from '@tanstack/react-query'
import {invoke} from '@tauri-apps/api/core'

import type {BacklogAuthentication} from './BacklogAuthentication'

export type BacklogProjectVersionAndMilestoneStruct = {
    id: number
    projectId: number
    name: string
}

export class BacklogProjectVersionAndMilestone {
    private readonly _authentication: BacklogAuthentication

    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication
    }

    // --- API Methods ---
    public async getAll(projectIdOrKey: number | string): Promise<BacklogProjectVersionAndMilestoneStruct[]> {
        const connection = await this._authentication.getConnection()
        if (!connection) return []
        const queryString: [string, string | boolean][] = []
        return invoke<BacklogProjectVersionAndMilestoneStruct[]>('backlog_project_version_and_milestone_list', {
            spaceUrl: connection.spaceUrl,
            projectIdOrKey: String(projectIdOrKey),
            queryString,
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    // --- React Query Hooks ---
    public useGetAll(projectIdOrKey: number | string | null,) {
        return useQuery({
            queryKey: ['backlog', 'project', 'version_and_milestone', 'list', 'backlog_project_version_and_milestone_list', String(projectIdOrKey)],
            queryFn: () => this.getAll(projectIdOrKey!),
            enabled: Boolean(projectIdOrKey),
        })
    }
}