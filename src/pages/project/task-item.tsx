import React from 'react'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import { TasksStore } from '../../stores/tasks-store'
import { Task } from '../../services/tasks-service'
import { EditTaskItem } from './edit-task-item'
import { isNil } from 'lodash'

import './task-item.scss'
import { toJS } from 'mobx'

interface TaskItemProps {
    task: Task
    disabledEditing?: boolean
    tasksStore?: TasksStore
}

export const TaskItem: React.FC<TaskItemProps> = inject(
    TasksStore.storeName,
)(observer(
    props => {
        const { task, disabledEditing, tasksStore } = props
        const { setEditingTask, editingTask, updateTask, removeTask } = tasksStore
        const { _id, completed, title, description, deadline, status } = task

        const handleTaskClick = (e: React.MouseEvent<HTMLDivElement>): void => {
            if (task.completed || disabledEditing) return

            setEditingTask(task)
        }

        if (!isNil(editingTask) && editingTask?._id === task._id && !task.completed && !disabledEditing) return (
            <EditTaskItem />
        )

        return (
            <Grid
                className="taskItem"
                item
                xs={12}
                container
                spacing={1}
                alignItems="center"
                onClick={handleTaskClick}
            >
                <Grid item xs={1}>
                    <Checkbox
                        color="primary"
                        checked={completed}
                        // MouseEvent type don't have `checked` key
                        onClick={(e: any) => {
                            e.stopPropagation()
                            updateTask({ ...task, completed: e.target.checked })
                        }}
                    />
                </Grid>

                <Grid item xs={8}>
                    <p className={classNames('taskTitle', {
                        ['completedTaskTitle']: task.completed,
                    })}>{title}</p>
                </Grid>

                <Grid item xs={2}>
                    <p className="taskDeadline">Due: {new Date(deadline).toLocaleDateString()}</p>
                </Grid>

                <Grid item xs={1}>
                    <IconButton
                        className="deleteTaskButton"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            removeTask(_id)
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        )
    }
))
