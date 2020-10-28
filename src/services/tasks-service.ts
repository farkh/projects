import {
    BaseHttpService, GET, POST, RequestOptions, DELETE,
    ErrorMiddleware, MiddlewaresParams, RequestMiddleware, ResponseMiddleware, PATCH,
} from './base-http-service'

const TASKS_BASE_URI = '/api/task'

export type TaskStatus = 'NEW' | 'IN_PROGRESS' | 'CLOSED'
export interface Task {
    _id?: string
    user_id?: any
    title?: string
    deadline?: string
    description?: string
    status?: TaskStatus
    completed?: boolean
    completion_date?: Date
    project_id?: string
}

export interface TasksResponse {
    success: boolean
    error?: string
    data: Task | Task[]
}

export class TasksService extends BaseHttpService {

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

    getProjectTasks = async (projectId: string, options: RequestOptions): Promise<TasksResponse> => {
        return super.send<TasksResponse>({
            method: GET,
            url: `${TASKS_BASE_URI}/project/${projectId}`,
        }, options)
    }

    getTasksByDate = async (date: string, options: RequestOptions): Promise<TasksResponse> => {
        return super.send<TasksResponse>({
            method: POST,
            url: `${TASKS_BASE_URI}/date`,
            data: {
                date,
            },
        }, options)
    }

    createTask = async (data: Task, options: RequestOptions): Promise<TasksResponse> => {
        return super.send<TasksResponse>({
            method: POST,
            url: TASKS_BASE_URI,
            data,
        }, options)
    }

    updateTask = async (id: string, data: Task, options: RequestOptions): Promise<TasksResponse> => {
        return super.send<TasksResponse>({
            method: PATCH,
            url: `${TASKS_BASE_URI}/${id}`,
            data,
        }, options)
    }

    removeTask = async (id: string, options: RequestOptions): Promise<TasksResponse> => {
        return super.send<TasksResponse>({
            method: DELETE,
            url: `${TASKS_BASE_URI}/${id}`
        }, options)
    }
}
