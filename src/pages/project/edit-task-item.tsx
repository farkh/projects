import React from 'react'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog'
import { TasksStore } from '../../stores/tasks-store'

interface EditTaskItemProps {
    tasksStore?: TasksStore
}

export const EditTaskItem: React.FC<EditTaskItemProps> = inject(
    TasksStore.storeName,
)(observer(
    props => {
        const editingTaskRef = React.useRef()
        const [confirmationOpen, setConfirmationOpen] = React.useState<boolean>(false)
        const { tasksStore } = props
        const {
            editingTask,
            modifyEditingTask,
            setEditingTask,
            setProjectTasks,
            projectTasks,
            saveTask,
            editingTaskModified,
        } = tasksStore

        const handleClearDummyTask = (): void => {
            if (editingTask._id === '-1' && !editingTask.title && !editingTask.description) {
                let tasks = projectTasks
                tasks.shift()
                setProjectTasks(tasks)
            }
        }

        const useOutsideAlerter = (ref) => {
            React.useEffect(() => {
                const handleClickOutside = (event): void => {
                    if (ref.current && !ref.current.contains(event.target)) {
                        if (editingTaskModified) {
                            setConfirmationOpen(true)
                        } else {
                            handleClearDummyTask()
                            setEditingTask(null)
                        }
                    }
                }
        
                document.addEventListener("mousedown", handleClickOutside)
                return () => {
                    document.removeEventListener("mousedown", handleClickOutside)
                }
            }, [ref, editingTaskModified])
        }

        useOutsideAlerter(editingTaskRef)

        return (
            <Paper ref={editingTaskRef} elevation={3} style={{ marginBottom: 16 }}>
                <Box p={1}>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Task title"
                                value={editingTask?.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingTask({ title: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <p className="taskDeadline">{new Date(editingTask?.deadline).toLocaleDateString()}</p>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                multiline
                                label="Description"
                                rows={3}
                                value={editingTask?.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingTask({ description: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} style={{ display: 'flex', backgroundColor: '#f1f1f1' }}>
                            <Button
                                id="cancelButton"
                                onClick={() => {
                                    if (editingTaskModified) {
                                        setConfirmationOpen(true)
                                    } else {
                                        handleClearDummyTask()
                                        setEditingTask(null)
                                    }
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                id="saveButton"
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    saveTask()
                                    setEditingTask(null)
                                }}
                                disabled={!editingTaskModified}
                                style={{ marginLeft: 'auto', marginRight: 8 }}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                {confirmationOpen && (
                    <ConfirmationDialog
                        message={'There are unsaved changes. Do you want to return and save them?'}
                        onNo={() => {
                            handleClearDummyTask()
                            setEditingTask(null)
                        }}
                        onYes={() => setConfirmationOpen(false)}
                    />
                )}
            </Paper>
        )
    }
))
