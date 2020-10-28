import React from 'react'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

import { DatePicker } from '../../components/date-picker/date-picker'
import { ProjectsStore } from '../../stores/projects-store'
import { TasksStore, createDummyTask } from '../../stores/tasks-store'
import { ActivityStore } from '../../stores/activity-store'
import { isNil } from 'lodash'

interface CreateTaskInputProps {
    tasksStore?: TasksStore
    activityStore?: ActivityStore
    projectsStore?: ProjectsStore
}

export const CreateTaskInput: React.FC<CreateTaskInputProps> = inject(
    TasksStore.storeName,
    ActivityStore.storeName,
    ProjectsStore.storeName,
)(observer(
    props => {
        const [formExpanded, setFormExpanded] = React.useState<boolean>(false)
        const { tasksStore, projectsStore, activityStore } = props
        const { editingTask, setEditingTask, modifyEditingTask, saveTask, reset, fetchTodayTasks } = tasksStore

        React.useEffect(() => {
            if (!projectsStore?.projects?.length) {
                projectsStore?.fetchProjects()
            }
            return () => {
                reset()
            }
        }, [])

        return (
            <Grid item xs={12} container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <Box p={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    <TextField
                                        fullWidth
                                        placeholder="Write new task"
                                        onClick={() => {
                                            if (isNil(editingTask)) {
                                                setFormExpanded(true)
                                                setEditingTask(createDummyTask())
                                            }
                                        }}
                                        value={editingTask?.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingTask({ title: e.target.value })}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <Select
                                        fullWidth
                                        label="Project"
                                        value={editingTask?.project_id}
                                        onClick={() => {
                                            if (isNil(editingTask)) {
                                                setFormExpanded(true)
                                                setEditingTask(createDummyTask())
                                            }
                                        }}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => modifyEditingTask({ project_id: e.target.value })}
                                    >
                                        <MenuItem value="">Project</MenuItem>
                                        {projectsStore?.projects?.map(project => (
                                            <MenuItem key={project._id} value={project._id}>
                                                {project.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>

                                {formExpanded && (
                                    <>
                                        <Grid item xs={8}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                placeholder="Task description"
                                                value={editingTask?.description}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingTask({ description: e.target.value })}
                                            />
                                        </Grid>

                                        <Grid item xs={4}>
                                            <DatePicker
                                                value={editingTask?.deadline}
                                                onValueChange={(deadline: string) => modifyEditingTask({ deadline })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} container spacing={0} justify="flex-end">
                                            <Button
                                                onClick={() => {
                                                    setEditingTask(null)
                                                    setFormExpanded(false)
                                                }}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                color="primary"
                                                variant="contained"
                                                disabled={!editingTask?.title?.trim() || !editingTask?.project_id}
                                                onClick={async () => {
                                                    await saveTask()
                                                    setEditingTask(null)
                                                    fetchTodayTasks()
                                                    activityStore?.fetchPastWeekActivities()
                                                    setFormExpanded(false)
                                                }}
                                                style={{
                                                    marginLeft: 8
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
))
