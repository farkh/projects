import {
    BaseHttpService, GET, POST, RequestOptions,
    ErrorMiddleware, MiddlewaresParams, RequestMiddleware, ResponseMiddleware,
} from './base-http-service'
import { UserFormData } from '../stores/auth-store'

const AUTH_BASE_URI = '/api/user'

export interface AuthData {
    token: string
    tokenExpiration: number
}

export interface AuthResponse {
    success: boolean
    error?: string
    data: AuthData
}

export class AuthService extends BaseHttpService {

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

    login = async (data: UserFormData, options: RequestOptions): Promise<AuthResponse> => {
        return super.send<AuthResponse>({
            method: POST,
            url: `${AUTH_BASE_URI}/login`,
            data,
        }, options)
    }

    register = async (data: UserFormData, options: RequestOptions): Promise<AuthResponse> => {
        return super.send<AuthResponse>({
            method: POST,
            url: `${AUTH_BASE_URI}/register`,
            data,
        }, options)
    }

    pullUser = async (): Promise<any> => {
        return super.send<any>({
            method: GET,
            url: `${AUTH_BASE_URI}/self`,
        })
    }
}
