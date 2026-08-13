import {BacklogEvent} from './event/BacklogEvent'
import {StrongholdStorage} from './tauri/StrongholdStorage'

export type BacklogAuthMethod = 'api-key' | 'oauth'

export type BacklogConnection = {
    method: BacklogAuthMethod
    spaceUrl: string
    apiKey?: string
    accessToken?: string
    refreshToken?: string
    tokenType?: string
    expiresAt?: number
    spaceKey?: string
    spaceName?: string
}

const STORAGE_KEY = 'datt-backlog-connection'
const CONNECTION_CHANGED_EVENT_NAME = 'backlog-connection-changed'

export class BacklogAuthentication {
    private readonly _storage: StrongholdStorage
    private readonly _connectionChangedEvent = BacklogEvent.global(
        CONNECTION_CHANGED_EVENT_NAME,
    )

    public constructor(storage: StrongholdStorage) {
        this._storage = storage
    }

    public async getConnection(): Promise<BacklogConnection | null> {
        return this._storage.get<BacklogConnection>(STORAGE_KEY)
    }

    public async saveConnection(connection: BacklogConnection): Promise<void> {
        await this._storage.set(STORAGE_KEY, connection)
        this._connectionChangedEvent.dispatch()
    }

    public async clearConnection(): Promise<void> {
        await this._storage.remove(STORAGE_KEY)
        this._connectionChangedEvent.dispatch()
    }

    public async getApiKey(): Promise<string> {
        return (await this.getConnection())?.apiKey ?? ''
    }

    public async saveApiKey(spaceUrl: string, apiKey: string): Promise<void> {
        await this.saveConnection({
            method: 'api-key',
            spaceUrl: spaceUrl.trim(),
            apiKey: apiKey.trim(),
        })
    }

    public async hasConnection(): Promise<boolean> {
        const connection = await this.getConnection()
        return Boolean(connection?.spaceUrl && (
            connection.method === 'api-key' ? connection.apiKey : connection.accessToken
        ))
    }
}
