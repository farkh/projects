import { observable, action, computed, toJS, runInAction } from 'mobx'
import { isEqual, isNil } from 'lodash'

import { store } from './stores-repository'
import { withSpinner } from './with-spinner'
import { Team, TeamService, TeamUserRole } from '../services/team-service'
import { NextMiddleware, RequestError, Response } from '../services/base-http-service'
import { AuthorizedUser } from './user-store'
import { TeamUser } from '../components/team-user/team-user'

export const createDummyTeam = (): Team => ({
    title: '',
    users: [],
    projects: [],
})

@store
export class TeamStore {
    static storeName: string = 'teamStore'

    @observable
    teams: Team[] = []

    @observable
    team: Team = null

    @observable
    editingTeam: Team = null

    @observable
    autocompleteValue: string = ''

    @observable
    autocompleteUsers: AuthorizedUser[] = []

    @observable
    autocompleteSelectedUser: AuthorizedUser = null

    @observable
    currentUserRole: TeamUserRole = TeamUserRole.R

    private debounceTimer: any = null
    private originalEditingTeam: Team = null
    private teamService: TeamService

    init = (serverUrl: string): void => {
        this.teamService = new TeamService(serverUrl, {})
    }

    @action
    setEditingTeam = (team?: Team): void => {
        this.editingTeam = team
        this.originalEditingTeam = team
    }

    @action
    setNewDummyTeam = (): void => {
        this.editingTeam = createDummyTeam()
    }

    @action
    modifyEditingTeam = (modification: Partial<Team>): void => {
        this.editingTeam = {
            ...(this.editingTeam || {}),
            ...modification,
        }
    }

    @action
    setAutocompleteSelectedValue = (user: AuthorizedUser): void => {
        this.autocompleteSelectedUser = user
    }

    @action
    setAutocompleteValue = (value: string): void => {
        this.autocompleteValue = value

        if (this.debounceTimer !== null) clearTimeout(this.debounceTimer)

        if (value.trim().length === 0) {
            this.autocompleteUsers = null
        } else {
            this.debounceTimer = setTimeout(() => this.searchUsersByEmail(value), 300)
        }
    }

    @computed
    get editingTeamModified(): boolean {
        return !isEqual(toJS(this.editingTeam), toJS(this.originalEditingTeam))
    }

    @computed
    get isNewTeam(): boolean {
        return isNil(this.originalEditingTeam)
    }

    @action
    saveTeam = (): void => {
        if (this.isNewTeam) {
            this.createTeam()
        } else {
            this.updateTeam()
        }
    }

    @action
    fetchTeams = async (): Promise<void> => {
        withSpinner(this.teamService.getUsersTeams({
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.teams = response.data.data
                next()
            }],
        }))
    }

    @action
    fetchTeamById = async (id: string): Promise<void> => {
        withSpinner(this.teamService.getTeam(id, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.team = response.data.data
                this.getTeamUser(response.data.data._id)
                next()
            }],
        }))
    }

    @action
    removeTeam = async (id: string): Promise<void> => {
        withSpinner(this.teamService.deleteTeam(id, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(_: Response, next: NextMiddleware) => {
                this.fetchTeams()
                next()
            }],
        }))
    }

    @action
    createTeam = async (): Promise<void> => {
        withSpinner(this.teamService.createTeam(this.editingTeam, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.erorr)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.resetEditingTeam()
                this.fetchTeams()
                next()
            }],
        }))
    }

    @action
    updateTeam = async (): Promise<void> => {
        withSpinner(this.teamService.updateTeam(this.editingTeam, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.resetEditingTeam()
                this.fetchTeams()
                next()
            }],
        }))
    }

    @action
    addUserToTeam = async ({ userId, role }: { userId: string, role: TeamUserRole }): Promise<void> => {
        withSpinner(this.teamService.addUserToTeam(this.editingTeam._id, userId, role, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                const updatedUsers = response.data.data.users
                this.editingTeam = { ...this.editingTeam, users: updatedUsers }
                this.originalEditingTeam = { ...this.editingTeam, users: updatedUsers }

                next()
            }],
        }))
    }

    @action
    removeUserFromTeam = async (userId: string): Promise<void> => {
        withSpinner(this.teamService.removeUserFromTeam(this.editingTeam._id, userId, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                const updatedUsers = response.data.data.users
                this.editingTeam = { ...this.editingTeam, users: updatedUsers }
                this.originalEditingTeam = { ...this.originalEditingTeam, users: updatedUsers }

                next()
            }],
        }))
    }

    @action
    searchUsersByEmail = async (email: string): Promise<void> => {
        this.teamService.searchUsersByEmail(email, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.autocompleteUsers = response.data.data
                next()
            }],
        })
    }

    @action
    getTeamUser = async (teamId: string): Promise<void> => {
        const response = await withSpinner(this.teamService.getTeamUser(teamId, {}))
        this.currentUserRole = response.data?.role as TeamUserRole
    }

    @action
    reset = (): void => {
        this.teams = []
        this.team = null
        this.editingTeam = null
        this.originalEditingTeam = null
        this.autocompleteUsers = []
        this.currentUserRole = TeamUserRole.R
    }

    @action
    resetTeam = (): void => {
        this.team = null
        this.currentUserRole = TeamUserRole.R
    }

    @action
    resetEditingTeam = (): void => {
        this.editingTeam = null
        this.originalEditingTeam = null
        this.autocompleteUsers = []
    }
}
