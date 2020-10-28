import React from 'react'
import { inject, observer } from 'mobx-react'
import { isNil } from 'lodash'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import EmojiPicker from 'emoji-picker-react'

import { ProjectsStore } from '../../stores/projects-store'

import './edit-project-dialog.scss'

interface EditProjectDialogProps {
    onClose: () => void
    projectsStore?: ProjectsStore
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = inject(
    ProjectsStore.storeName,
)(observer(
    props => {
        const [emojiPickerOpen, setEmojiPickerOpen] = React.useState<boolean>(false)
        const { onClose, projectsStore } = props
        const { editingProject, modifyEditingProject, saveProject } = projectsStore
        const isNew = isNil(editingProject)

        return (
            <Dialog
                id="createProjectDialog"
                className="createProjectDialog"
                open
                maxWidth="md"
            >
                <DialogTitle>
                    {isNew ? 'Create' : 'Edit'} project
                    <Paper
                        className="editProjectDialogColor"
                        style={{ backgroundColor: editingProject?.color || '#ffffff' }}
                        elevation={3}
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                    >
                        {editingProject?.emoji}
                    </Paper>
                    {emojiPickerOpen && (
                        <div
                            style={{
                                position: 'fixed',
                                zIndex: 99,
                                left: '50%',
                                boxShadow: '0 10px 20px #efefef',
                            }}
                        >
                            <EmojiPicker
                                onEmojiClick={(e: MouseEvent, emojiObj: any) => {
                                    modifyEditingProject({ emoji: emojiObj.emoji })
                                    setEmojiPickerOpen(false)
                                }}
                            />
                        </div>
                    )}
                </DialogTitle>

                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="projectTitleInput"
                                name="title"
                                fullWidth
                                variant="outlined"
                                value={editingProject?.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingProject({ title: e.target.value })}
                                label="Title"
                                placeholder="Enter title"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                id="projectDescriptionInput"
                                name="description"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                value={editingProject?.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingProject({ description: e.target.value })}
                                label="Description"
                                placeholder="Enter description"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                id="projectColorInput"
                                name="color"
                                fullWidth
                                variant="outlined"
                                type="color"
                                value={editingProject?.color}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingProject({ color: e.target.value })}
                                label="Color"
                                placeholder="Choose color"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                id="projectDeadlineInput"
                                name="deadline"
                                fullWidth
                                variant="outlined"
                                type="date"
                                value={editingProject?.deadline}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingProject({ deadline: new Date(e.target.value) })}
                                label="Due date"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        id="cancelButton"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        id="createButton"
                        color="primary"
                        variant="contained"
                        onClick={saveProject}
                        style={{ marginLeft: 'auto' }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
))
