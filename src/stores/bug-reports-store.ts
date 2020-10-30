import { observable, action, runInAction } from 'mobx'

import { getStore, store } from './stores-repository'
import { BugReport, BugReportsService, Page } from '../services/bug-reports-service'
import { withSpinner } from './with-spinner'
import { NextMiddleware, Response } from '../services/base-http-service'

@store
export class BugReportsStore {
    static storeName: string = 'bugReportsStore'

    @observable
    bugReports: BugReport[] = []

    @observable
    editingBugReport: BugReport = null

    @observable
    pageFilter: Page = null

    private bugReportsService: BugReportsService = null

    init = (serverUrl: string): void => {
        this.bugReportsService = new BugReportsService(serverUrl, {})
    }

    @action
    setPageFilter = (page?: Page): void => {
        this.pageFilter = page
        if (!page) this.fetchBugReports()
    }

    @action
    modifyEditingBugReport = (modification: Partial<BugReport>): void => {
        this.editingBugReport = {
            ...(this.editingBugReport || {}),
            ...modification,
        }
    }

    @action
    setEditingBugReport = (report: BugReport): void => {
        this.editingBugReport = report
    }

    @action
    fetchBugReports = async (): Promise<void> => {
        const response = await withSpinner(this.bugReportsService.getBugReports())
        this.bugReports = response?.data
    }

    @action
    fetchBugReportsByPage = async (): Promise<void> => {
        const response = await withSpinner(this.bugReportsService.getBugReportsByPage(this.pageFilter))
        this.bugReports = response?.data
    }

    @action
    createBugReport = async (): Promise<void> => {
        withSpinner(this.bugReportsService.createBugReport(this.editingBugReport, {
            responseMiddlewares: [(_: Response, next: NextMiddleware) => {
                this.fetchBugReports()
                next()
            }],
        }))
    }

    @action
    removeBugReport = async (id: string): Promise<void> => {
        withSpinner(this.bugReportsService.deleteBugReport(id, {
            responseMiddlewares: [(_: Response, next: NextMiddleware) => {
                this.fetchBugReports()
                next()
            }],
        }))
    }

    @action
    reset = (): void => {
        this.bugReports = []
        this.pageFilter = null
        this.editingBugReport = null
    }

    @action
    resetEditing = (): void => {
        this.editingBugReport = null
    }
}