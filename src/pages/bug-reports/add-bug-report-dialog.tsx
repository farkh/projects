import React from 'react'
import { inject, observer } from 'mobx-react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

import { getPageOpts } from './bug-reports-page'
import { Page } from '../../services/bug-reports-service'
import { BugReportsStore } from '../../stores/bug-reports-store'

interface AddBugReportDialogProps {
    onClose: () => void
    bugReportsStore?: BugReportsStore
}

export const AddBugReportDialog: React.FC<AddBugReportDialogProps> = inject(
    BugReportsStore.storeName,
)(observer(
    props => {
        const { onClose, bugReportsStore } = props
        const { editingBugReport, modifyEditingBugReport, createBugReport, reset } = bugReportsStore

        return (
            <Dialog open>
                <DialogTitle>Create bug report</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                placeholder="Bug title"
                                value={editingBugReport?.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value.length > 30) return
                                    modifyEditingBugReport({ title: e.target.value })
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="page-select-label">Page</InputLabel>
                                <Select
                                    id="page-select-label"
                                    fullWidth
                                    label="Project"
                                    value={editingBugReport?.page}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => modifyEditingBugReport({ page: e.target.value as Page })}
                                >
                                    {getPageOpts().map(page => (
                                        <MenuItem key={page.value} value={page.value}>{page.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                placeholder="Bug's description"
                                value={editingBugReport?.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value.length > 250) return
                                    modifyEditingBugReport({ description: e.target.value })
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            onClose()
                            reset()
                        }
                    }>
                        Cancel
                    </Button>

                    <Button
                        color="primary"
                        variant="contained"
                        disabled={!editingBugReport?.title || !editingBugReport?.page || !editingBugReport?.description}
                        onClick={() => {
                            onClose()
                            createBugReport()
                            reset()
                        }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
))
