import {useQuery} from '@tanstack/react-query'
import {invoke} from '@tauri-apps/api/core'

import type {BacklogAuthentication} from './BacklogAuthentication'
import type {BacklogUser} from './BacklogUsers'

export type BacklogProjectUser = BacklogUser

export type BacklogProjectUserListOptions = {
    excludeGroupMembers?: boolean
}

export class BacklogProjectUsers {
    private readonly _authentication: BacklogAuthentication

    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication
    }

    // --- API Methods ---

    public async getAll(
        projectIdOrKey: number | string,
        options?: BacklogProjectUserListOptions,
    ): Promise<BacklogProjectUser[]> {
        const connection = await this._authentication.getConnection()
        if (!connection) return []

        const queryString: [string, string | boolean][] = [
            ['excludeGroupMembers', options?.excludeGroupMembers ?? true],
        ]

        return invoke<BacklogProjectUser[]>('backlog_project_user_list', {
            spaceUrl: connection.spaceUrl,
            projectIdOrKey: String(projectIdOrKey),
            queryString,
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    // --- React Query Hooks ---

    public useGetAll(
        projectIdOrKey: number | string | null,
        options?: BacklogProjectUserListOptions,
    ) {
        return useQuery({
            queryKey: ['backlog', 'project_users', 'list', 'backlog_project_user_list', String(projectIdOrKey), options],
            queryFn: () => this.getAll(projectIdOrKey!, options),
            enabled: Boolean(projectIdOrKey),
        })
    }
}