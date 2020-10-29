import React from 'react'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { DatePicker } from '../../components/date-picker/date-picker'
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
            if (editingTask?._id === '-1') {
                let tasks = projectTasks
                tasks.shift()
                setProjectTasks(tasks)
            }
        }

        const useOutsideClearer = (ref) => {
            React.useEffect(() => {
                const handleClickOutside = (event): void => {
                    const datepickerContainer = document.querySelector('.MuiPickersBasePicker-container')

                    if (ref.current && !ref.current.contains(event.target) && !datepickerContainer?.contains(event.target)) {
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

        useOutsideClearer(editingTaskRef)

        return (
            <Paper ref={editingTaskRef} elevation={3} style={{ marginBottom: 16 }}>
                <Box p={1}>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                label="Task title"
                                value={editingTask?.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingTask({ title: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <DatePicker
                                value={editingTask?.deadline}
                                onValueChange={deadline => modifyEditingTask({ deadline })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                label="Description"
                                rows={2}
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
