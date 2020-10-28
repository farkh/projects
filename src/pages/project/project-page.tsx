import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import moment from 'moment'
import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import AddIcon from '@material-ui/icons/Add'

import { TaskItem } from './task-item'

import { TasksStore, createDummyTask } from '../../stores/tasks-store'
import { ProjectsStore } from '../../stores/projects-store'

import './project-page.scss'
import { Task } from '../../services/tasks-service'

interface ProjectPageProps extends RouteComponentProps<{ id: string }> {
    tasksStore?: TasksStore
    projectsStore?: ProjectsStore
}

export const ProjectPage: React.FC<ProjectPageProps> = inject(
    TasksStore.storeName,
    ProjectsStore.storeName,
)(observer(
    props => {
        const { projectsStore, tasksStore, match } = props
        const { openProject, project, resetCurrentProject } = projectsStore
        const { projectTasks, fetchProjectTasks, setEditingTask, editingTask, setProjectTasks } = tasksStore
        const { id } = match.params

        React.useEffect(() => {
            openProject(id)
            fetchProjectTasks(id)

            return () => {
                resetCurrentProject()
            }
        }, [id])

        if (!project) return null
        const completedTasks = projectTasks?.filter(task => task.completed)
        const notCompletedTasks = projectTasks?.filter(task => !task.completed)

        const calculateProgress = (): number => Math.round(completedTasks?.length / projectTasks?.length * 100)

        const handleAddNewTask = (): void => {
            if (editingTask?._id === '-1') return
            const dummyTask: Task = createDummyTask(id)

            setEditingTask(dummyTask)
            setProjectTasks([dummyTask, ...projectTasks])
        }

        return (
            <Grid container spacing={0} justify="center" style={{ height: '100%' }}>
                <Grid item xs={12} md={8}>
                    <Paper className="projectContainer">
                        <Paper elevation={2} className="projectColorBlock" style={{ backgroundColor: project.color }}>
                            {project.emoji}
                        </Paper>
                        <Box p={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <h1 className="projectTitle">{project?.title}</h1>
                                </Grid>

                                {project?.deadline && (
                                    <Grid item xs={12} container spacing={0} justify="center">
                                        <Grid item xs={4}>
                                            <Paper
                                                elevation={2}
                                                className="deadlineContainer"
                                            >
                                                Due {moment(project?.deadline).format('DD MMM YYYY')}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <h3>{project?.description}</h3>
                                </Grid>

                                {projectTasks?.length > 0 && (
                                    <Grid item xs={12} container spacing={2}>
                                        <Grid item xs={10}>
                                            Progress
                                        </Grid>
                                        <Grid item xs={2} container justify="flex-end">{calculateProgress()}%</Grid>
                                        <Grid item xs={12}>
                                            <LinearProgress variant="determinate" value={calculateProgress()} />
                                        </Grid>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <h2>Tasks</h2>
                                </Grid>

                                <Grid item xs={12} container spacing={0}>
                                    {!projectTasks?.length && (
                                        <p style={{ marginTop: 0 }}>Create first task!</p>
                                    )}
                                    {notCompletedTasks?.map(task => (
                                        <TaskItem key={task._id} task={task} />
                                    ))}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {completedTasks?.length > 0 && (
                        <Paper style={{ marginTop: 16 }}>
                            <Box p={1}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <h2>Completed tasks</h2>
                                    </Grid>

                                    <Grid item xs={12} container spacing={0}>
                                        {completedTasks.map(task => (
                                            <TaskItem key={task._id} task={task} />
                                        ))}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    )}

                    <Fab
                        color="primary"
                        onClick={() => handleAddNewTask()}
                        style={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            zIndex: 2,
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Grid>
            </Grid>
        )
    }
))

export default withRouter(ProjectPage)
