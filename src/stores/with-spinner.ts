import { getStore } from './stores-repository'
import { AppStore } from './app-store'
import { last } from 'lodash'

type SpinnerRequest<T> = Promise<T> | (() => Promise<T>)

export const withSpinner = async <T>(request: SpinnerRequest<T> | Array<SpinnerRequest<T>>): Promise<T> => {
    if (!request) {
        return Promise.resolve(undefined)
    }

    const makeRequest = (request: SpinnerRequest<T>): Promise<T> => {
        return typeof request === 'function' ? request() : request
    }

    const appStore: AppStore = getStore<AppStore>(AppStore.storeName)
    appStore.setLoading(true)
    try {
        const result = Array.isArray(request)
            ? last(await Promise.all(request.map(makeRequest)))
            : await makeRequest(request)
        appStore.setLoading(false)
        return result
    } catch (error) {
        appStore.setLoading(false)
        return Promise.reject(error)
    }
}
