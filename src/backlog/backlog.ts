import {BacklogAuthentication, type BacklogConnection} from './BacklogAuthentication'
import {StrongholdStorage} from './tauri/StrongholdStorage'
import {BacklogProjects} from './BacklogProjects'
import {BacklogUsers} from './BacklogUsers'
import {BacklogIssues} from './BacklogIssues.ts'
import {BacklogProjectUsers} from "@/backlog/BacklogProjectUsers.ts";
import {BacklogProjectIssueTypes} from "@/backlog/BacklogProjectIssueTypes.ts";
import {BacklogProjectStatus} from "@/backlog/BacklogProjectStatus.ts";
import {BacklogPriority} from "@/backlog/BacklogPriority.ts";
import {BacklogResolution} from "@/backlog/BacklogResolution.ts";
import {BacklogProjectVersionAndMilestone} from "@/backlog/BacklogProjectVersionAndMilestone.ts";
import {BacklogProjectCategory} from "@/backlog/BacklogProjectCategory.ts";

export class Backlog {
    private readonly _authentication: BacklogAuthentication
    public readonly priority: BacklogPriority
    public readonly resolution: BacklogResolution
    public readonly users: BacklogUsers
    public readonly projects: BacklogProjects
    public readonly projectCategory: BacklogProjectCategory
    public readonly projectIssueTypes: BacklogProjectIssueTypes
    public readonly projectStatus: BacklogProjectStatus
    public readonly projectUsers: BacklogProjectUsers
    public readonly projectVersionAndMilestone: BacklogProjectVersionAndMilestone
    public readonly issues: BacklogIssues


    public constructor(authentication: BacklogAuthentication) {
        this._authentication = authentication


        this.priority = new BacklogPriority(authentication)
        this.resolution = new BacklogResolution(authentication)
        this.users = new BacklogUsers(authentication)
        this.projects = new BacklogProjects(authentication)
        this.projectCategory = new BacklogProjectCategory(authentication)
        this.projectIssueTypes = new BacklogProjectIssueTypes(authentication)
        this.projectStatus = new BacklogProjectStatus(authentication)
        this.projectUsers = new BacklogProjectUsers(authentication)
        this.projectVersionAndMilestone = new BacklogProjectVersionAndMilestone(authentication)
        this.issues = new BacklogIssues(authentication)
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
