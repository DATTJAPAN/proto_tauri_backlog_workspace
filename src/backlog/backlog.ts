import {BacklogAuthentication, type BacklogConnection} from './auth'
import {StrongholdStorage} from './tauri/stronghold'
import {BacklogProjects} from './project'
import {BacklogUsers} from './user'

export class Backlog {
    private readonly _authentication: BacklogAuthentication
    public readonly projects: BacklogProjects
    public readonly users: BacklogUsers

    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication
        this.projects = new BacklogProjects(authentication)
        this.users = new BacklogUsers(authentication)
    }

    public async getConnection(): Promise<BacklogConnection | null> {
        return this._authentication.getConnection()
    }

    public async isConnected(): Promise<boolean> {
        return this._authentication.hasConnection()
    }

    public async connectWithOAuth(
        spaceUrl: string,
        accessToken: string,
        details: Omit<BacklogConnection, 'method' | 'spaceUrl' | 'accessToken'> = {},
    ): Promise<void> {
        await this._authentication.saveConnection({
            method: 'oauth',
            spaceUrl: spaceUrl.trim(),
            accessToken,
            ...details,
        })
    }

    public async connectWithApiKey(spaceUrl: string, apiKey: string): Promise<void> {
        await this._authentication.saveApiKey(spaceUrl, apiKey)
    }

    public async disconnect(): Promise<void> {
        await this._authentication.clearConnection()
        this.projects.clearActive()
    }
}

export const backlog = new Backlog(
    new BacklogAuthentication(new StrongholdStorage()),
)
