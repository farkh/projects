import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import qs from 'qs'

export const GET = 'get'
export const POST = 'post'
export const PUT = 'put'
export const PATCH = 'patch'
export const DELETE = 'delete'

export type RequestError = AxiosError
export type RequestConfig = AxiosRequestConfig
export type Response = AxiosResponse

export type NextMiddleware = () => void

export type RequestMiddleware = (config: RequestConfig, next: NextMiddleware) => void
export type ResponseMiddleware = (response: Response, next: NextMiddleware) => void
export type ErrorMiddleware = (error: RequestError, next: NextMiddleware) => void

export interface MiddlewaresParams {
    /**
     * Массив функций, вызывающихся перед каждым запросом.
     */
    requestMiddlewares?: RequestMiddleware[]
    /**
     * Массив функций, вызывающихся перед возвратом response
     */
    responseMiddlewares?: ResponseMiddleware[]
    /**
     * Массив функций, вызывающихся перед возвратом error
     */
    errorMiddlewares?: ErrorMiddleware[]
}

export interface RequestOptions extends MiddlewaresParams {
}

export abstract class BaseHttpService {

    static generalRequestMiddlewares: RequestMiddleware[] = []
    static generalResponseMiddlewares: ResponseMiddleware[] = []
    static generalErrorMiddlewares: ErrorMiddleware[] = []

    abstract serviceRequestMiddlewares: RequestMiddleware[]
    abstract serviceResponseMiddlewares: ResponseMiddleware[]
    abstract serviceErrorMiddlewares: ErrorMiddleware[]

    serverUrl: string = ''

    setServerUrl = (serverUrl: string): void => {
        this.serverUrl = serverUrl
    }

    protected async send<T>(config: RequestConfig, options: RequestOptions = {}): Promise<T> {
        let requestStart: number = Date.now()

        const {
            requestMiddlewares = [],
            responseMiddlewares = [],
            errorMiddlewares = []
        } = options

        /* applies middlewares in order: method(LIFO), service(LIFO), general(LIFO) */
        this.handleRequestMiddlewares(config, [
            ...requestMiddlewares.concat().reverse(),
            ...this.serviceRequestMiddlewares.concat().reverse(),
            ...BaseHttpService.generalRequestMiddlewares.concat().reverse(),
        ])

        return axios.request({
            baseURL: this.serverUrl,
            paramsSerializer: qs.stringify,
            ...config,
        })
            .then((response) => {
                console.debug(`BaseHttpService: <== ${Date.now() - requestStart}ms, data:\n`, {
                    method: config.method,
                    params: config.params,
                    url: this.serverUrl + config.url,
                    data: config.data,
                    response: response.data
                })

                /* applies middlewares in order: method(LIFO), service(LIFO), general(LIFO) */
                this.handleResponseMiddlewares(response, [
                    ...responseMiddlewares.concat().reverse(),
                    ...this.serviceResponseMiddlewares.concat().reverse(),
                    ...BaseHttpService.generalResponseMiddlewares.concat().reverse(),
                ])

                return response.data
            })
            .catch((error: AxiosError) => {
                console.error(`BaseHttpService: <== ${Date.now() - requestStart}ms, Axios error:\n`, {
                    method: config.method,
                    params: config.params,
                    url: this.serverUrl + config.url,
                    data: config.data,
                    error: error
                })

                /* applies middlewares in order: method(LIFO), service(LIFO), general(LIFO) */
                this.handleErrorMiddlewares(error, [
                    ...errorMiddlewares.concat().reverse(),
                    ...this.serviceErrorMiddlewares.concat().reverse(),
                    ...BaseHttpService.generalErrorMiddlewares.concat().reverse(),
                ])
            })
    }

    private handleRequestMiddlewares = (requestConfig: RequestConfig, requestMiddlewares: RequestMiddleware[]): void => {
        if (requestMiddlewares.length === 0) {
            return
        }

        const [firstMv, ...otherMvs] = requestMiddlewares

        firstMv(requestConfig, () => {
            this.handleRequestMiddlewares(requestConfig, otherMvs)
        })
    }

    private handleResponseMiddlewares = (response: Response, responseMiddlewares: ResponseMiddleware[]): void => {
        if (responseMiddlewares.length === 0) {
            return
        }

        const [firstMv, ...otherMvs] = responseMiddlewares

        firstMv(response, () => {
            this.handleResponseMiddlewares(response, otherMvs)
        })
    }

    private handleErrorMiddlewares = (error: RequestError, errorMiddlewares: ErrorMiddleware[]): void => {
        if (errorMiddlewares.length === 0) {
            return
        }

        const [firstMv, ...otherMvs] = errorMiddlewares

        firstMv(error, () => {
            this.handleErrorMiddlewares(error, otherMvs)
        })
    }
}
