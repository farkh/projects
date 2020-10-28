import { observable, action, computed } from 'mobx'
import { isNil } from 'lodash'

import { store } from './stores-repository'

export interface AuthorizedUser {
    id: string
    name: string
    email: string
    avatar: string
}

@store
export class UserStore {
    static storeName: string = 'userStore'

    @observable
    currentUser: AuthorizedUser = null

    @action
    setCurrentUser = (user: AuthorizedUser): void => {
        this.currentUser = user
    }

    @computed
    get loggedIn(): boolean {
        return !isNil(this.currentUser)
    }

    @action
    reset = (): void => {
        this.currentUser = null
    }
}
