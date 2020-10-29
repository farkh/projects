import { observable, action, computed, toJS } from 'mobx'
import moment from 'moment'
import { isEqual, isNil } from 'lodash'

import { store } from './stores-repository'
import { withSpinner } from './with-spinner'
import { Task, TasksService } from '../services/tasks-service'
import { NextMiddleware, RequestError, Response } from '../services/base-http-service'

export const createDummyTask = (projectId?: string): Task => ({
    _id: '-1',
    title: '',
    deadline: moment().add('1', 'days').format('DD MMM YYYY'),
    description: '',
    status: 'NEW',
    completed: false,
    completion_date: null,
    project_id: projectId || '',
})

@store
export class TasksStore {
    static storeName: string = 'tasksStore'

    @observable
    projectTasks: Task[] = []

    @observable
    todayTasks: Task[] = []

    @observable
    editingTask: Task = null

    private projectId: string = null
    private originalEditingTask: Task = null
    private tasksService: TasksService = null

    init = (serverUrl: string): void => {
        this.tasksService = new TasksService(serverUrl, {})
    }

    @computed
    get editingTaskModified(): boolean {
        return !isEqual(toJS(this.editingTask), toJS(this.originalEditingTask))
    }

    @action
    setEditingTask = (task: Task): void => {
        this.editingTask = task
        this.originalEditingTask = task
    }

    @action
    setProjectTasks = (tasks: Task[]): void => {
        this.projectTasks = tasks
    }

    @action
    modifyEditingTask = (modification: Partial<Task>): void => {
        this.editingTask = {
            ...(this.editingTask || {}),
            ...modification,
        }
    }

    @action
    fetchProjectTasks = async (projectId: string): Promise<void> => {
        this.projectId = projectId
        withSpinner(this.tasksService.getProjectTasks(projectId, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.setProjectTasks(response.data.data)
                next()
            }],
        }))
    }

    @action
    fetchTodayTasks = async (): Promise<void> => {
        withSpinner(this.tasksService.getTasksByDate(moment().format('DD MMM YYYY'), {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.todayTasks = response.data.data
                next()
            }]
        }))
    }

    saveTask = async (): Promise<void> => {
        if (this.editingTask._id === '-1') {
            await this.createTask()
        } else {
            await this.updateTask()
        }
    }

    @action
    createTask = async (): Promise<void> => {
        withSpinner(this.tasksService.createTask(this.editingTask, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                if (this.projectId) this.fetchProjectTasks(this.projectId)
                next()
            }],
        }))
    }

    @action
    updateTask = async (task?: Task): Promise<void> => {
        const editedTask = isNil(task) ? this.editingTask : task
        const editingIndex: number = this.projectTasks?.findIndex(task => task._id === editedTask._id)
        const todayTaskIndex: number = this.todayTasks?.findIndex(task => task._id === editedTask._id)

        // Immediately update tasks list for better UX
        this.setProjectTasks([
            ...this.projectTasks.slice(0, editingIndex),
            editedTask,
            ...this.projectTasks.slice(editingIndex + 1),
        ])
        if (todayTaskIndex > -1) {
            this.todayTasks = [
                ...this.todayTasks.slice(0, todayTaskIndex),
                editedTask,
                ...this.todayTasks.slice(todayTaskIndex + 1),
            ]
        }

        this.tasksService.updateTask(editedTask._id, editedTask, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.setEditingTask(null)
                next()
            }],
        })
    }

    @action
    removeTask = async (id: string): Promise<void> => {
        withSpinner(this.tasksService.removeTask(id, {
            errorMiddlewares: [(error: RequestError, _: NextMiddleware) => {
                console.log('error!!', error.response.data.error)
            }],
            responseMiddlewares: [(response: Response, next: NextMiddleware) => {
                this.fetchProjectTasks(this.projectId)
                next()
            }],
        }))
    }

    @action
    reset = (): void => {
        this.projectId = null
        this.projectTasks = []
        this.todayTasks = []
        this.editingTask = null
        this.originalEditingTask = null
    }
}
