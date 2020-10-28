import React from 'react'
import { inject, observer } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { TaskItem } from '../../pages/project/task-item'
import { TasksStore } from '../../stores/tasks-store'

interface TodayTasksProps {
    tasksStore?: TasksStore
}

export const TodayTasks: React.FC<TodayTasksProps> = inject(
    TasksStore.storeName,
)(observer(
    props => {
        const { todayTasks, fetchTodayTasks } = props.tasksStore

        React.useEffect(() => {
            fetchTodayTasks()
        }, [])

        return (
            <Grid item xs={12} container spacing={2}>
                <Grid item xs={12}>
                    <h2 style={{ marginBottom: 4 }}>Today</h2>
                </Grid>

                {!todayTasks?.length && (
                    <Grid item xs={12}>
                        No tasks for today
                    </Grid>
                )}

                <Grid item xs={12} style={{ overflow: 'hidden' }}>
                    <Paper style={{ marginRight: -20 }}>
                        <Grid container spacing={0} style={{ maxHeight: 265, overflow: 'hidden', overflowY: 'auto' }}>
                            {todayTasks?.length > 0 && todayTasks?.map(task => (
                                <TaskItem key={task._id} task={task} />
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
))
