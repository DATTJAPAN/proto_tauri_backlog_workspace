import type {BacklogAuthentication} from "@/backlog/BacklogAuthentication.ts";
import {invoke} from "@tauri-apps/api/core";
import {useQuery} from "@tanstack/react-query";


export type BacklogPriorityStruct = {
    id: number
    name: string
}

export class BacklogPriority {
    private readonly _authentication: BacklogAuthentication

    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication
    }

    // --- API Methods ---

    public async getAll(): Promise<BacklogPriorityStruct[]> {
        const connection = await this._authentication.getConnection()
        if (!connection) return []

        return invoke<BacklogPriorityStruct[]>('backlog_priority_list', {
            spaceUrl: connection.spaceUrl,
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }


    // --- React Query Hooks ---

    public useGetAll() {
        return useQuery({
            queryKey: ['backlog', 'priority', 'list', 'backlog_priority_list'],
            queryFn: () => this.getAll(),
        })
    }
}