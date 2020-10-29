import { observable, action, runInAction } from 'mobx'
import moment from 'moment'

import { store } from './stores-repository'
import { withSpinner } from './with-spinner'
import { ProjectsService, Project, ProjectsFilter } from '../services/projects-serivce'
import { NextMiddleware, RequestError, Response } from '../services/base-http-service'
import { isNil } from 'lodash'

export const dummyProject: Project = {
    title: '',
    description: '',
    color: '#083D77',
    deadline: moment().add(1, 'days').format('DD MMM YYYY'),
}

@store
export class ProjectsStore {
    static storeName: string = 'projectsStore'

    @observable
    projects: Project[] = []

    @observable
    favoriteProjects: Project[] = []

    @observable
    editingProject: Project = null

    @observable
    editDialogOpen: boolean = false

    @observable
    project: Project = null

    @observable
    filter: ProjectsFilter = null

    private originalEditingProject: Project = null
    private projectsService: ProjectsService = null

    init = (serverUrl: string): void => {
        this.projectsService = new ProjectsService(serverUrl, {})
    }

    @action
    setEditingProject = (project?: Project): void => {
        this.editingProject = project
        this.originalEditingProject = project
    }

    @action
    setDummyProject = (): void => {
        this.editingProject = dummyProject
    }

    @action
    modifyEditingProject = (modification: Partial<Project>): void => {
        this.editingProject = {
            ...(this.editingProject || {}),
            ...modification,
        }
    }

    @action
    modifyFilter = (modification: Partial<ProjectsFilter>): void => {
        this.filter = {
            ...(this.filter || {}),
            ...modification,
        }
    }

    @action
    setEditDialogOpen = (open: boolean): void => {
        this.editDialogOpen = open
    }

    saveProject = (): void => {
        if (isNil(this.originalEditingProject)) {
            this.createNewProject()
        } else {
            this.updateProject()
        }
    }

    @action
    createNewProject = async (): Promise<void> => {
        withSpinner(this.projectsService.createProject(this.editingProject, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                console.log('new project', response.data.data)
                this.setEditDialogOpen(false)
                this.fetchProjects()

                next()
            }],
        }))
    }

    @action
    updateProject = async (project?: Project): Promise<void> => {
        const editingProject = isNil(project) ? this.editingProject : project

        withSpinner(this.projectsService.updateProjectById(editingProject._id, editingProject, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                console.log('updated project', response.data.data)
                this.setEditDialogOpen(false)
                this.fetchProjects()

                next()
            }]
        }))
    }

    @action
    removeProject = async (id: string): Promise<void> => {
        withSpinner(this.projectsService.removeProjectById(id, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                console.log('removed', response.data)
                this.fetchProjects()

                next()
            }],
        }))
    }

    @action
    fetchProjects = async (filter?: ProjectsFilter): Promise<void> => {
        const appliedFilter = isNil(filter) ? this.filter : filter

        withSpinner(this.projectsService.getUserProjects({
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.projects = response.data.data
                next()
            }],
        }, appliedFilter))
    }

    @action
    fetchFavoriteProjects = async (): Promise<void> => {
        const appliedFilter: ProjectsFilter = { favorite: true }

        withSpinner(this.projectsService.getUserProjectsByFilter(appliedFilter, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.favoriteProjects = response.data.data
                next()
            }],
        }))
    }

    @action
    openProject = async (id: string): Promise<void> => {
        withSpinner(this.projectsService.getProjectById(id, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.project = response.data.data
                next()
            }],
        }))
    }

    @action
    resetCurrentProject = (): void => {
        this.project = null
        this.editDialogOpen = false
        this.editingProject = null
        this.originalEditingProject = null
    }

    @action
    reset = (): void => {
        this.project = null
        this.projects = []
        this.editDialogOpen = false
        this.editingProject = null
        this.originalEditingProject = null
    }
}
