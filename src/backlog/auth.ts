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
const LEGACY_API_KEY = 'datt-backlog-api-key'
const CONNECTION_CHANGED_EVENT = 'backlog-connection-changed'

export class BacklogAuthentication {
  public getConnection(): BacklogConnection | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored) as BacklogConnection
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    localStorage.removeItem(LEGACY_API_KEY)
    return null
  }

  public saveConnection(connection: BacklogConnection): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connection))
    localStorage.removeItem(LEGACY_API_KEY)
    window.dispatchEvent(new Event(CONNECTION_CHANGED_EVENT))
  }

  public clearConnection(): void {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LEGACY_API_KEY)
    window.dispatchEvent(new Event(CONNECTION_CHANGED_EVENT))
  }

  public getApiKey(): string {
    return this.getConnection()?.apiKey ?? ''
  }

  public saveApiKey(spaceUrl: string, apiKey: string): void {
    this.saveConnection({
      method: 'api-key',
      spaceUrl: spaceUrl.trim(),
      apiKey: apiKey.trim(),
    })
  }

  public hasConnection(): boolean {
    const connection = this.getConnection()
    return Boolean(connection?.spaceUrl && (
      connection.method === 'api-key' ? connection.apiKey : connection.accessToken
    ))
  }
}
