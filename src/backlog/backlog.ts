import {BacklogAuthentication, type BacklogConnection} from './auth'

export class Backlog {
  private readonly _authentication: BacklogAuthentication

  public constructor(authentication: BacklogAuthentication) {
    this._authentication = authentication
  }

  public get connection(): BacklogConnection | null {
    return this._authentication.getConnection()
  }

  public isConnected(): boolean {
    return this._authentication.hasConnection()
  }

  public connectWithOAuth(spaceUrl: string, accessToken: string): void {
    this._authentication.saveConnection({
      method: 'oauth',
      spaceUrl: spaceUrl.trim(),
      accessToken,
    })
  }

  public connectWithApiKey(spaceUrl: string, apiKey: string): void {
    this._authentication.saveApiKey(spaceUrl, apiKey)
  }

  public disconnect(): void {
    this._authentication.clearConnection()
  }
}

export const backlog = new Backlog(new BacklogAuthentication())
