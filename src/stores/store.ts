import { ALL_STORES, getStore, putStore } from './stores-repository'

import { AppStore } from './app-store'
import { UserStore } from './user-store'
import { ThemeStore } from './theme-store'
import { AuthStore } from './auth-store'
import { TasksStore } from './tasks-store'
import { ProjectsStore } from './projects-store'
import { ActivityStore } from './activity-store'
import { BugReportsStore } from './bug-reports-store'
import { TeamStore } from './team-store'

export const createStore = (): {[storeName: string]: any} => {
    putStore(AppStore.storeName, new AppStore())
    putStore(UserStore.storeName, new UserStore())
    putStore(ThemeStore.storeName, new ThemeStore())
    putStore(TasksStore.storeName, new TasksStore())
    putStore(ActivityStore.storeName, new ActivityStore())
    putStore(BugReportsStore.storeName, new BugReportsStore())
    putStore(TeamStore.storeName, new TeamStore())
    putStore(ProjectsStore.storeName, new ProjectsStore())
    putStore(AuthStore.storeName, new AuthStore())

    let store: any = {}
    ALL_STORES.forEach(storeName => {
        store[storeName] = getStore(storeName)
    })
    return store
}
