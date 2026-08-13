import {appDataDir, join} from '@tauri-apps/api/path'
import {invoke} from '@tauri-apps/api/core'
import {type Client, Stronghold} from '@tauri-apps/plugin-stronghold'

const VAULT_FILE_NAME = 'backlog-vault.hold'
const CLIENT_NAME = 'backlog'
const OPERATION_TIMEOUT_MILLISECONDS = 30_000

type StrongholdContext = {
  stronghold: Stronghold
  client: Client
}

export class StrongholdStorage {
  private _contextPromise: Promise<StrongholdContext> | null = null

  public async get<TValue>(key: string): Promise<TValue | null> {
    const {client} = await this.__getContext()
    const storedValue = await this.__withTimeout(
      client.getStore().get(key),
      'read from Stronghold',
    )
    if (!storedValue) {
      return null
    }

    const serializedValue = new TextDecoder().decode(storedValue)
    return JSON.parse(serializedValue) as TValue
  }

  public async set<TValue>(key: string, value: TValue): Promise<void> {
    const {stronghold, client} = await this.__getContext()
    const serializedValue = JSON.stringify(value)
    const encodedValue = Array.from(new TextEncoder().encode(serializedValue))

    await this.__withTimeout(
      client.getStore().insert(key, encodedValue),
      'write to Stronghold',
    )
    await this.__withTimeout(stronghold.save(), 'save the Stronghold vault')
  }

  public async remove(key: string): Promise<void> {
    const {stronghold, client} = await this.__getContext()
    await this.__withTimeout(
      client.getStore().remove(key),
      'remove the Stronghold record',
    )
    await this.__withTimeout(stronghold.save(), 'save the Stronghold vault')
  }

  private async __getContext(): Promise<StrongholdContext> {
    if (!this._contextPromise) {
      this._contextPromise = this.__initialize()
    }

    try {
      return await this._contextPromise
    } catch (error) {
      this._contextPromise = null
      throw error
    }
  }

  private async __initialize(): Promise<StrongholdContext> {
    const vaultPath = await join(await appDataDir(), VAULT_FILE_NAME)
    const vaultPassword = await invoke<string>('get_or_create_vault_password')
    const stronghold = await Stronghold.load(vaultPath, vaultPassword)

    try {
      return {stronghold, client: await stronghold.loadClient(CLIENT_NAME)}
    } catch {
      return {stronghold, client: await stronghold.createClient(CLIENT_NAME)}
    }
  }

  private async __withTimeout<TValue>(
    operation: Promise<TValue>,
    operationName: string,
  ): Promise<TValue> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Timed out while trying to ${operationName}.`))
      }, OPERATION_TIMEOUT_MILLISECONDS)
    })

    try {
      return await Promise.race([operation, timeout])
    } finally {
      clearTimeout(timeoutId)
    }
  }
}
