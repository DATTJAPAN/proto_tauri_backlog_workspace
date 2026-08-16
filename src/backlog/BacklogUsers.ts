import {useQuery} from '@tanstack/react-query'
import {invoke} from '@tauri-apps/api/core'

import type {BacklogAuthentication} from './BacklogAuthentication'

export type BacklogUser = {
    id: number
    userId: string | null
    name: string
    roleType: number
    lang: string | null
    mailAddress: string | null
    nulabAccount: {
        nulabId: string
        name: string
        uniqueId: string
        iconUrl?: string
    } | null
    keyword: string | null
    lastLoginTime: string | null
}

export class BacklogUsers {
    private readonly _authentication: BacklogAuthentication

    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication
    }

    // --- API Methods ---

    public async getCurrent(): Promise<BacklogUser | null> {
        const connection = await this._authentication.getConnection()
        if (!connection) return null

        return invoke<BacklogUser>('backlog_get_current_user', {
            spaceUrl: connection.spaceUrl,
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    // --- React Query Hooks ---

    public useGetCurrent() {
        return useQuery({
            queryKey: ['backlog', 'users', 'current', 'backlog_get_current_user'],
            queryFn: () => this.getCurrent(),
        })
    }
}