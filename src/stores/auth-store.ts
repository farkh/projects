import { observable, action, runInAction } from 'mobx'

import { AuthService } from '../services/auth-service'
import { UserStore } from './user-store'
import { getStore, store } from './stores-repository'
import { setAuthToken } from '../utils/auth'
import { deleteCookie, getCookie, setCookie } from '../utils/cookies'
import { withSpinner } from './with-spinner'
import { AppStore } from './app-store'
import { NextMiddleware, RequestError, Response } from '../services/base-http-service'

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

@store
export class AuthStore {
    static storeName: string = 'authStore'

    @observable
    userData: UserFormData = {}

    @observable
    authType: AuthType = AuthType.Login

    @observable
    errorMessage: string = ''

    private authService: AuthService = null
    private userStore: UserStore = getStore<UserStore>(UserStore.storeName)
    private appStore: AppStore = getStore<AppStore>(AppStore.storeName)

    init = (serverUrl: string) => {
        this.authService = new AuthService(serverUrl, {})
    }

    @action
    setAuthType = (authType: AuthType): void => {
        this.authType = authType
        this.setErrorMessage(null)
    }

    @action
    setUserData = (user: Partial<UserFormData>): void => {
        this.userData = {
            ...this.userData,
            ...user,
        }
        this.setErrorMessage(null)
    }

    @action
    setErrorMessage = (message: string): void => {
        this.errorMessage = message
    }

    @action
    login = async (): Promise<void> => {
        withSpinner(this.authService.login(this.userData, {
            errorMiddlewares: [(error: RequestError, next: NextMiddleware) => {
                this.setErrorMessage(error.response.data.error)
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
        if (this.userData.password !== this.userData.passwordConfirmation) {
            this.setErrorMessage('Passwords must match')
            return
        }

        withSpinner(this.authService.register(this.userData, {
            errorMiddlewares: [(error: RequestError, next: NextMiddleware) => {
                this.setErrorMessage(error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                const { token, tokenExpiration } = response.data.data

                setCookie('authorization', token, { expiresIn: tokenExpiration * 7 * 24 * 60 * 60 })
                setAuthToken(token)
                this.pullUser()
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
        this.userStore.setCurrentUser(null)
    }

    @action
    reset = (): void => {
        this.userData = {}
        this.authType = AuthType.Login
        this.errorMessage = ''
    }
}
