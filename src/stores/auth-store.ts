import { observable, action, runInAction, computed } from 'mobx'

import { AuthService } from '../services/auth-service'
import { getStore, store } from './stores-repository'
import { setAuthToken } from '../utils/auth'
import { deleteCookie, getCookie, setCookie } from '../utils/cookies'
import { withSpinner } from './with-spinner'
import { NextMiddleware, RequestError, Response } from '../services/base-http-service'

import { AppStore } from './app-store'
import { UserStore } from './user-store'
import { ProjectsStore } from './projects-store'
import { TasksStore } from './tasks-store'

interface AuthError {
    email?: string
    password?: string
}

export interface UserFormData {
    name?: string
    email?: string
    avatar?: string
    password?: string
    passwordConfirmation?: string
}

export enum AuthType {
    Login = 'LOGIN',
    Register = 'REGISTER',
}

const validEmailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@store
export class AuthStore {
    static storeName: string = 'authStore'

    @observable
    userData: UserFormData = {}

    @observable
    authType: AuthType = AuthType.Login

    @observable
    error: AuthError = null

    private authService: AuthService = null
    private userStore: UserStore = getStore<UserStore>(UserStore.storeName)
    private appStore: AppStore = getStore<AppStore>(AppStore.storeName)
    private projectsStore: ProjectsStore = getStore<ProjectsStore>(ProjectsStore.storeName)
    private tasksStore: TasksStore = getStore<TasksStore>(TasksStore.storeName)

    init = (serverUrl: string) => {
        this.authService = new AuthService(serverUrl, {})
    }

    @action
    setAuthType = (authType: AuthType): void => {
        this.authType = authType
        this.userData = {}
        this.setError(null)
    }

    @action
    setUserData = (user: Partial<UserFormData>): void => {
        this.userData = {
            ...this.userData,
            ...user,
        }
        this.setError(null)
    }

    @computed
    get isFormValid(): boolean {
        const { email, password, passwordConfirmation, name } = this.userData

        if (!password?.trim()?.length || password?.trim()?.length < 6) return false
        if (this.authType === AuthType.Register && password !== passwordConfirmation) return false
        if (this.authType === AuthType.Register && !name?.trim()?.length) return false

        return validEmailRegexp.test(email)
    }

    @action
    setError = (message: AuthError): void => {
        this.error = message
    }

    @action
    login = async (): Promise<void> => {
        withSpinner(this.authService.login(this.userData, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                this.setError({ password: error.response.data.error })
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                const { token, tokenExpiration } = response.data.data

                setCookie('authorization', token, { expiresIn: tokenExpiration * 7 * 24 * 60 * 60 })
                setAuthToken(token)
                this.pullUser()
                next()
            }],
        }))
    }

    @action
    register = async (): Promise<void> => {
        withSpinner(this.authService.register(this.userData, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                this.setError({ email: error.response.data.error })
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                const { token, tokenExpiration } = response.data.data

                setCookie('authorization', token, { expiresIn: tokenExpiration * 7 * 24 * 60 * 60 })
                setAuthToken(token)
                this.pullUser()
                next()
            }],
        }))
    }

    @action
    pullUser = async (): Promise<void> => {
        const token = getCookie('authorization')
        setAuthToken(token)
        if (!token) {
            this.logout()
            this.appStore.setAppLoaded(true)
            return
        }
        const response = await withSpinner(this.authService.pullUser())
        runInAction(() => {
            this.userStore.setCurrentUser(response.data)
            this.appStore.setAppLoaded(true)
            this.reset()
        })
    }

    @action
    logout = (): void => {
        setAuthToken(null)
        deleteCookie('authorization')

        // Reset all stores
        this.userStore.reset()
        this.projectsStore.reset()
        this.tasksStore.reset()
    }

    @action
    reset = (): void => {
        this.userData = {}
        this.authType = AuthType.Login
        this.error = null
    }
}
