import React from 'react'
import { inject, observer } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import { AutocompleteInput } from '../../components/autocomplete-input/autocomplete-input'
import { TeamUserRole } from '../../services/team-service'
import { TeamStore } from '../../stores/team-store'
import { AuthorizedUser } from '../../stores/user-store'

import './add-team-user-dialog.scss'

const getTeamUserRoleOpts = (): { value: number, label: string }[] =>
    Object.keys(TeamUserRole).map(key => ({
        value: TeamUserRole[key],
        label: key,
    }))

interface AddTeamUserDialogProps {
    // onAdd: ({ userId: string, role: TeamUserRole }) => void
    onClose: () => void
    teamStore?: TeamStore
}

export const AddTeamUserDialog: React.FC<AddTeamUserDialogProps> = inject(
    TeamStore.storeName,
)(observer(
    ({ onClose, teamStore }) => {
        const [role, setRole] = React.useState<TeamUserRole>(TeamUserRole.R)
        const {
            addUserToTeam,
            autocompleteUsers,
            autocompleteValue,
            setAutocompleteValue,
            setAutocompleteSelectedValue,
            autocompleteSelectedUser,
        } = teamStore

        console.log('getTeamUserRoleOpts', role, Object.keys(TeamUserRole), getTeamUserRoleOpts())

        return (
            <Dialog open onClose={onClose} className="addUserDialog">
                <DialogTitle>Add user to team</DialogTitle>

                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <AutocompleteInput<AuthorizedUser>
                                value={autocompleteValue}
                                onInputChange={setAutocompleteValue}
                                options={autocompleteUsers}
                                label="User"
                                labelRenderer={(item: AuthorizedUser) => item.email}
                                onSelect={setAutocompleteSelectedValue}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="team-user-role">Role</InputLabel>
                                <Select
                                    id="team-user-role"
                                    fullWidth
                                    value={role}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as TeamUserRole)}
                                >
                                    {getTeamUserRoleOpts().map(role => (
                                        <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            addUserToTeam({ userId: autocompleteSelectedUser._id, role })
                            onClose()
                        }}
                    >
                        <AddIcon /> Add
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
))
