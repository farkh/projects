import {
    BaseHttpService, GET, POST, RequestOptions, DELETE,
    ErrorMiddleware, MiddlewaresParams, RequestMiddleware, ResponseMiddleware,
} from './base-http-service'

const REPORTS_BASE_URI = '/api/reports'

export enum Page {
    Main = 'main',
    Auth = 'auth',
    Projects = 'projects',
    Project = 'project',
}

export interface BugReport {
    _id?: string
    user_id?: any
    issuerAvatar?: string
    title?: string
    page?: Page
    description?: string
}

interface BugReportsResponse {
    success: boolean
    error?: string
    data: BugReport[]
}

export class BugReportsService extends BaseHttpService {

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

    createBugReport = async (report: BugReport, options: RequestOptions): Promise<BugReportsResponse> => {
        return super.send<BugReportsResponse>({
            method: POST,
            url: REPORTS_BASE_URI,
            data: report,
        }, options)
    }

    getBugReports = async (): Promise<BugReportsResponse> => {
        return super.send<BugReportsResponse>({
            method: GET,
            url: REPORTS_BASE_URI,
        })
    }

    getBugReportsByPage = async (page: Page): Promise<BugReportsResponse> => {
        return super.send<BugReportsResponse>({
            method: POST,
            url: `${REPORTS_BASE_URI}/page`,
            data: { page },
        })
    }

    deleteBugReport = async (id: string, options: RequestOptions): Promise<BugReportsResponse> => {
        return super.send<BugReportsResponse>({
            method: DELETE,
            url: `${REPORTS_BASE_URI}/${id}`,
        }, options)
    }
}
