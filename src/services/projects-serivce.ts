import {
    BaseHttpService, GET, POST, RequestOptions, DELETE,
    ErrorMiddleware, MiddlewaresParams, RequestMiddleware, ResponseMiddleware, PATCH,
} from './base-http-service'

const PROJECTS_BASE_URI = '/api/project'

export interface ProjectsFilter {
    title?: string
    color?: string
    cateogry?: any
    deadline?: string
    favorite?: boolean
}

export interface Project {
    _id?: string
    user_id?: any
    title?: string
    description?: string
    color?: string
    deadline?: string
    category?: any
    favorite?: boolean
    emoji?: string
}

export interface ProjectsResponse {
    success: boolean
    error?: string
    data: Project | Project[]
}

export class ProjectsService extends BaseHttpService {

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

    getUserProjects = async (options: RequestOptions, filter?: ProjectsFilter): Promise<ProjectsResponse> => {
        return super.send<ProjectsResponse>({
            method: GET,
            url: PROJECTS_BASE_URI,
            data: {
                filter,
            },
        }, options)
    }

    getUserProjectsByFilter = async (filter: ProjectsFilter, options: RequestOptions): Promise<ProjectsResponse> => {
        return super.send<ProjectsResponse>({
            method: POST,
            url: `${PROJECTS_BASE_URI}/filter`,
            data: {
                filter,
            },
        }, options)
    }

    createProject = async (data: Project, options: RequestOptions): Promise<ProjectsResponse> => {
        return super.send<ProjectsResponse>({
            method: POST,
            url: PROJECTS_BASE_URI,
            data,
        }, options)
    }

    getProjectById = async (id: string, options: RequestOptions): Promise<ProjectsResponse> => {
        return super.send<ProjectsResponse>({
            method: GET,
            url: `${PROJECTS_BASE_URI}/${id}`,
        }, options)
    }

    removeProjectById = async (id: string, options: RequestOptions): Promise<ProjectsResponse> => {
        return super.send<ProjectsResponse>({
            method: DELETE,
            url: `${PROJECTS_BASE_URI}/${id}`,
        }, options)
    }

    updateProjectById = async (id: string, data: Partial<Project>, options: RequestOptions): Promise<ProjectsResponse> => {
        return super.send<ProjectsResponse>({
            method: PATCH,
            url: `${PROJECTS_BASE_URI}/${id}`,
            data,
        }, options)
    }
}
