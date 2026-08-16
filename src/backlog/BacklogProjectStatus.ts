import type {BacklogAuthentication} from "@/backlog/BacklogAuthentication.ts";
import {invoke} from "@tauri-apps/api/core";
import {useQuery} from "@tanstack/react-query";


export type BacklogProjectStatusStruct = {
  id: number
  projectId: number
  name: string
  color: string
  displayOrder: number
}
export class BacklogProjectStatus {
  private readonly _authentication: BacklogAuthentication

  public constructor(authentication: BacklogAuthentication) {
    this._authentication = authentication
  }

  // --- API Methods ---

  public async getAll(projectIdOrKey: number | string): Promise<BacklogProjectStatusStruct[]> {
    const connection = await this._authentication.getConnection()
    if (!connection) return []

    const queryString: [string, string | boolean][] = []

    return invoke<BacklogProjectStatusStruct[]>('backlog_project_status_list', {
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
      queryKey: ['backlog', 'project_status', 'list', 'backlog_project_status_list', String(projectIdOrKey)],
      queryFn: () => this.getAll(projectIdOrKey!),
      enabled: Boolean(projectIdOrKey),
    })
  }
}