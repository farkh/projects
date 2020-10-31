import React from 'react'
import { inject, observer } from 'mobx-react'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'

import { TeamItem } from './team-item'
import { EditTeamDialog } from './edit-team-dialog'
import { TeamStore } from '../../stores/team-store'

import './teams-page.scss'

interface TeamsPageProps {
    teamStore?: TeamStore
}

export const TeamsPage: React.FC<TeamsPageProps> = inject(
    TeamStore.storeName,
)(observer(
    props => {
        const [editDialogOpen, setEditDialogOpen] = React.useState<boolean>(false)
        const { teams, fetchTeams, setNewDummyTeam, setEditingTeam } = props.teamStore

        React.useEffect(() => {
            fetchTeams()
        }, [])

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1>Teams</h1>
                </Grid>

                <Grid item xs={12} container spacing={2}>
                    {teams?.map(team => (
                        <TeamItem
                            team={team}
                            onEditClick={() => {
                                setEditingTeam(team)
                                setEditDialogOpen(true)
                            }}
                        />
                    ))}
                </Grid>

                <Fab
                    color="primary"
                    onClick={() => {
                        setNewDummyTeam()
                        setEditDialogOpen(true)
                    }}
                    className="fab"
                >
                    <AddIcon />
                </Fab>

                {editDialogOpen && (
                    <EditTeamDialog onClose={() => setEditDialogOpen(false)} />
                )}
            </Grid>
        )
    }
))

export default TeamsPage
