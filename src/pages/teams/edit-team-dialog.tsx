import React from 'react'
import { inject, observer } from 'mobx-react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'

import { AddTeamUserDialog } from './add-team-user-dialog'
import { TeamUser } from '../../components/team-user/team-user'
import { TeamStore } from '../../stores/team-store'

import './edit-team-dialog.scss'
import { toJS } from 'mobx'

interface EditTeamDialogProps {
    onClose: () => void
    teamStore?: TeamStore
}

export const EditTeamDialog: React.FC<EditTeamDialogProps> = inject(
    TeamStore.storeName,
)(observer(
    props => {
        const [addUserDialogOpen, setAddUserDialogOpen] = React.useState<boolean>(false)
        const { onClose, teamStore } = props
        const {
            editingTeam,
            resetEditingTeam,
            modifyEditingTeam,
            editingTeamModified,
            isNewTeam,
            saveTeam,
            removeUserFromTeam,
        } = teamStore

        console.log('editingTeam', toJS(editingTeam))

        return (
            <Dialog open onClose={onClose}>
                <DialogTitle>{isNewTeam ? 'Create' : 'Edit'} team</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="teamTitleInput"
                                fullWidth
                                placeholder="Title"
                                value={editingTeam?.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => modifyEditingTeam({ title: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} container spacing={1} className="teamUsersContainer">
                            <Grid item xs={12}>
                                <Button onClick={() => setAddUserDialogOpen(true)}><AddIcon /> Add user</Button>
                            </Grid>
                            <Grid item xs={12}>
                                {editingTeam?.users?.map(user => (
                                    <TeamUser key={user._id} user={user} onDeleteClick={() => removeUserFromTeam(user._id)} />
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            resetEditingTeam()
                            onClose()
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        id="createButton"
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            saveTeam()
                            onClose()
                        }}
                        disabled={!editingTeamModified}
                        style={{ marginLeft: 'auto' }}
                    >
                        Save
                    </Button>
                </DialogActions>

                {addUserDialogOpen && (
                    <AddTeamUserDialog onClose={() => setAddUserDialogOpen(false)} />
                )}
            </Dialog>
        )
    }
))
