import {
    BaseHttpService, GET, POST, RequestOptions, DELETE,
    ErrorMiddleware, MiddlewaresParams, RequestMiddleware, ResponseMiddleware, PATCH,
} from './base-http-service'
import { AuthorizedUser } from '../stores/user-store'
import { Project } from './projects-serivce'

const TEAM_BASE_URI = '/api/teams'
const USER_BASE_URI = '/api/user'
const TEAM_USER_BASE_URI = '/api/team-user'

export interface Team {
    _id?: string
    creator_id?: any
    users?: AuthorizedUser[]
    title?: string
    projects?: Project[]
}

export interface TeamUser {
    _id?: string
    user_id?: string
    team_id?: string
    role?: TeamUserRole
}

export enum TeamUserRole {
    Owner = '1',
    RWD = '2',
    RW = '3',
    R = '4',
}

export interface TeamResponse {
    success: boolean
    data: Team | Team[]
    error?: string
}

export interface UserResponse {
    success: boolean
    data: AuthorizedUser[]
    error?: string
}

export interface TeamUserResponse {
    success: boolean
    data: TeamUser
    error?: string
}

export class TeamService extends BaseHttpService {

    serviceRequestMiddlewares: RequestMiddleware[] = []
    serviceResponseMiddlewares: ResponseMiddleware[] = []
    serviceErrorMiddlewares: ErrorMiddleware[] = []

    constructor(serverUrl: string, middlewaresParams: MiddlewaresParams) {
        super()
        this.setServerUrl(serverUrl)

        this.serviceRequestMiddlewares = middlewaresParams.requestMiddlewares || []
        this.serviceResponseMiddlewares = middlewaresParams.responseMiddlewares || []
        this.serviceErrorMiddlewares = middlewaresParams.errorMiddlewares || []
    }

    createTeam = async (team: Team, options: RequestOptions): Promise<TeamResponse> => {
        return super.send<TeamResponse>({
            method: POST,
            url: TEAM_BASE_URI,
            data: team,
        }, options)
    }

    updateTeam = async (team: Team, options: RequestOptions): Promise<TeamResponse> => {
        return super.send<TeamResponse>({
            method: PATCH,
            url: `${TEAM_BASE_URI}/${team._id}`,
            data: team,
        }, options)
    }

    addUserToTeam = async (teamId: string, userId: string, role: TeamUserRole, options: RequestOptions): Promise<TeamResponse> => {
        return super.send<TeamResponse>({
            method: POST,
            url: `${TEAM_BASE_URI}/users/add/${teamId}`,
            data: {
                userId,
                role,
            },
        }, options)
    }

    removeUserFromTeam = async (teamId: string, userId: string, options: RequestOptions): Promise<TeamResponse> => {
        return super.send<TeamResponse>({
            method: POST,
            url: `${TEAM_BASE_URI}/users/remove/${teamId}`,
            data: { userId },
        }, options)
    }

    getTeam = async (teamId: string, options: RequestOptions): Promise<TeamResponse> => {
        return super.send<TeamResponse>({
            method: GET,
            url: `${TEAM_BASE_URI}/${teamId}`,
        }, options)
    }

    getUsersTeams = async (options: RequestOptions): Promise<TeamResponse> => {
        return super.send<TeamResponse>({
            method: GET,
            url: TEAM_BASE_URI,
        }, options)
    }

    deleteTeam = async (teamId: string, options: RequestOptions): Promise<TeamResponse> => {
        return super.send<TeamResponse>({
            method: DELETE,
            url: `${TEAM_BASE_URI}/${teamId}`,
        }, options)
    }

    searchUsersByEmail = async (email: string, options: RequestOptions): Promise<UserResponse> => {
        return super.send<UserResponse>({
            method: POST,
            url: `${USER_BASE_URI}/email`,
            data: { email }
        }, options)
    }

    getTeamUser = async (teamId: string, options: RequestOptions): Promise<TeamUserResponse> => {
        return super.send<TeamUserResponse>({
            method: GET,
            url: `${TEAM_USER_BASE_URI}/${teamId}`,
        }, options)
    }
}
