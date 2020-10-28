import { action, observable } from 'mobx'
import { store } from './stores-repository'

@store
export class AppStore {

    static storeName: string = 'appStore'

    @observable
    loading: boolean = false

    @observable
    appLoaded: boolean = false

    @action
    setLoading = (loading: boolean): void => {
        this.loading = loading
    }

    @action
    setAppLoaded = (loaded: boolean): void => {
        this.appLoaded = loaded
    }
}
