import {invoke} from '@tauri-apps/api/core'

import type {BacklogAuthentication} from './BacklogAuthentication'
import {BacklogEvent} from './event/BacklogEvent'

export type BacklogProject = {
    id: number
    projectKey: string
    name: string
    archived: boolean
}

const ACTIVE_PROJECT_STORAGE_KEY = 'datt-active-backlog-project-id'
const ACTIVE_PROJECT_CHANGED_EVENT_NAME = 'backlog-active-project-changed'

export class BacklogProjects {
    private readonly _authentication: BacklogAuthentication
    private readonly _activeProjectChangedEvent = BacklogEvent.global(
        ACTIVE_PROJECT_CHANGED_EVENT_NAME,
    )

    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication
    }

    public async getAll(): Promise<BacklogProject[]> {
        const connection = await this._authentication.getConnection()
        if (!connection) return []

        return invoke<BacklogProject[]>('backlog_project_list', {
            spaceUrl: connection.spaceUrl,
            apiKey: connection.method === 'api-key' ? connection.apiKey : null,
            accessToken: connection.method === 'oauth' ? connection.accessToken : null,
        })
    }

    public getActiveId(): number | null {
        const savedId = window.localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY)
        if (!savedId) return null

        const projectId = Number(savedId)
        return Number.isSafeInteger(projectId) ? projectId : null
    }

    public setActive(projectId: number): void {
        if (!Number.isSafeInteger(projectId)) {
            throw new Error('Backlog project ID must be an integer.')
        }

        if (this.getActiveId() === projectId) return

        window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, String(projectId))
        this._activeProjectChangedEvent.dispatch()
    }

    public clearActive(): void {
        if (this.getActiveId() === null) return

        window.localStorage.removeItem(ACTIVE_PROJECT_STORAGE_KEY)
        this._activeProjectChangedEvent.dispatch()
    }

    public onActiveChanged(listener: (projectId: number | null) => void): () => void {
        const handleChange = () => listener(this.getActiveId())
        window.addEventListener(this._activeProjectChangedEvent.eventName, handleChange)

        return () => {
            window.removeEventListener(this._activeProjectChangedEvent.eventName, handleChange)
        }
    }
}
