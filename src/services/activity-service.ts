import {
    BaseHttpService, GET, POST, RequestOptions, DELETE,
    ErrorMiddleware, MiddlewaresParams, RequestMiddleware, ResponseMiddleware, PATCH,
} from './base-http-service'

const ACTIVITY_BASE_URI = '/api/activity'

export type ActivityType =
    'ADD_PROJECT' | 'ADD_TASK' | 'BEGIN_TASK' | 'COMPLETE_TASK' | 'COMPLETE_PROJECT' |
    'EDIT_PROJECT' | 'EDIT_TASK' | 'BEGIN_PROJECT' | 'DELETE_PROJECT' | 'DELETE_TASK'

export interface Activity {
    _id?: string
    user_id?: any
    type?: ActivityType
    activity_object?: string
}

export interface ActivityResponse {
    success: boolean
    error?: string
    data: Activity | Activity[]
}

export class ActivityService extends BaseHttpService {

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

    getAllActivities = async (options: RequestOptions): Promise<ActivityResponse> => {
        return super.send<ActivityResponse>({
            method: GET,
            url: ACTIVITY_BASE_URI,
        }, options)
    }

    getTodayActivities = async (options: RequestOptions): Promise<ActivityResponse> => {
        return super.send<ActivityResponse>({
            method: GET,
            url: `${ACTIVITY_BASE_URI}/today`,
        }, options)
    }

    getPastWeekActivities = async (options: RequestOptions): Promise<ActivityResponse> => {
        return super.send<ActivityResponse>({
            method: GET,
            url: `${ACTIVITY_BASE_URI}/week`,
        }, options)
    }
}
