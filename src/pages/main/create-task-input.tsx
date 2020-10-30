import React from 'react'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

import { DatePicker } from '../../components/date-picker/date-picker'
import { ProjectsStore } from '../../stores/projects-store'
import { TasksStore, createDummyTask } from '../../stores/tasks-store'
import { ActivityStore } from '../../stores/activity-store'
import { isNil } from 'lodash'
import { toJS } from 'mobx'

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
        // Reset material UI inputs
        const [inputKey, setInputKey] = React.useState<number>(0)
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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <Box p={2}>
                            <Grid container spacing={2} alignItems="flex-end">
                                <Grid item xs={12} md={9}>
                                    <TextField
                                        key={`taskTitle-${inputKey}`}
                                        fullWidth
                                        placeholder="Write new task"
                                        onClick={() => {
                                            if (isNil(editingTask)) {
                                                setFormExpanded(true)
                                                setEditingTask(createDummyTask())
                                            }
                                        }}
                                        value={editingTask?.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.value?.length > 30) return
                                            modifyEditingTask({ title: e.target.value })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="project-select-label">Project</InputLabel>
                                        <Select
                                            key={`projectSelect-${inputKey}`}
                                            id="project-select-label"
                                            fullWidth
                                            label="Project"
                                            // placeholder="Project"
                                            value={editingTask?.project_id}
                                            onClick={() => {
                                                if (isNil(editingTask)) {
                                                    setFormExpanded(true)
                                                    setEditingTask(createDummyTask())
                                                }
                                            }}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => modifyEditingTask({ project_id: e.target.value })}
                                        >
                                            {projectsStore?.projects?.map(project => (
                                                <MenuItem key={project._id} value={project._id}>
                                                    {project.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {formExpanded && (
                                    <>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                key={`descriptionInput-${inputKey}`}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                placeholder="Task description"
                                                value={editingTask?.description}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.value?.length > 250) return
                                                    modifyEditingTask({ description: e.target.value })
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <DatePicker
                                                key={`deadlineInput-${inputKey}`}
                                                fullWidth
                                                value={editingTask?.deadline}
                                                onValueChange={(deadline: string) => modifyEditingTask({ deadline })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} container spacing={0} justify="flex-end">
                                            <Button
                                                onClick={() => {
                                                    setInputKey(inputKey + 1)
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
                                                    setInputKey(inputKey)
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
