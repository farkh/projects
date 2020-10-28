import { observable, action } from 'mobx'

import { store } from './stores-repository'
import { withSpinner } from './with-spinner'
import { Activity, ActivityService } from '../services/activity-service'
import { NextMiddleware, RequestError, Response } from '../services/base-http-service'

@store
export class ActivityStore {
    static storeName: string = 'activityStore'

    @observable
    activities: Activity[] = []

    private activityService: ActivityService = null

    init = (serverUrl: string): void => {
        this.activityService = new ActivityService(serverUrl, {})
    }

    @action
    fetchAllActivities = async (): Promise<void> => {
        withSpinner(this.activityService.getAllActivities({
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.activities = response.data.data
            }],
        }))
    }

    @action
    fetchTodayActivities = async (): Promise<void> => {
        withSpinner(this.activityService.getTodayActivities({
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.activities = response.data.data
            }],
        }))
    }

    @action
    fetchPastWeekActivities = async (): Promise<void> => {
        withSpinner(this.activityService.getPastWeekActivities({
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.activities = response.data.data
            }],
        }))
    }

    @action
    reset = (): void => {
        this.activities = []
    }
}
