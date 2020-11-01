import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import { ProjectItem } from '../projects/project-item'
import { EditProjectDialog } from '../projects/edit-project-dialog'
import { TeamUser } from '../../components/team-user/team-user'
import { TeamStore } from '../../stores/team-store'
import { ProjectsStore } from '../../stores/projects-store'

import './team-page.scss'

interface TeamPageProps extends RouteComponentProps<{ id: string }> {
    teamStore?: TeamStore
    projectsStore?: ProjectsStore
}

export const TeamPage: React.FC<TeamPageProps> = inject(
    TeamStore.storeName,
    ProjectsStore.storeName,
)(observer(
    props => {
        const { match, teamStore, projectsStore } = props
        const { team, fetchTeamById, currentUserRole, resetTeam } = teamStore
        const { editDialogOpen, setDummyProject, setEditDialogOpen, setEditingProject, setTeamId } = projectsStore
        const { id: teamId } = match.params

        React.useEffect(() => {
            fetchTeamById(teamId)

            return () => {
                resetTeam()
            }
        }, [])

        if (!team) return null

        return (
            <Paper style={{ height: '100%' }}>
                <Box p={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h1 style={{ textAlign: 'center' }}>{team.title}</h1>
                        </Grid>

                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                            {team.users?.map(user => (
                                <TeamUser key={user._id} user={user} />
                            ))}
                        </Grid>

                        <Grid item xs={12}>
                            <h3>Team projects</h3>
                        </Grid>

                        <Grid item xs={12} container spacing={2}>
                            {team.projects?.map(project => (
                                <ProjectItem
                                    project={project}
                                    onEditClick={() => {
                                        setEditingProject(project)
                                        setEditDialogOpen(true)
                                    }}
                                />
                            ))}
                        </Grid>
                    </Grid>
                </Box>

                <Fab
                    color="primary"
                    onClick={() => {
                        setTeamId(teamId)
                        setDummyProject()
                        setEditDialogOpen(true)
                    }}
                    className="fab"
                >
                    <AddIcon />
                </Fab>

                {editDialogOpen && (
                    <EditProjectDialog onClose={() => setEditDialogOpen(false)} />
                )}
            </Paper>
        )
    }
))

export default withRouter(TeamPage)
