import React from 'react'
import { NavLink } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import { Team } from '../../services/team-service'
import { Routes } from '../../core/routes'

import './team-item.scss'

interface TeamItemProps {
    team: Team
    onEditClick?: () => void
}

export const TeamItem: React.FC<TeamItemProps> = ({ team, onEditClick }) => (
    <Box p={1} className="teamItem">
        <Paper style={{ height: '100%' }}>
            <Grid container spacing={2} justify="space-between" style={{ height: '100%' }}>
                <Grid item xs={12}>
                    <p className="teamTitle">{team.title}</p>
                </Grid>

                <Grid item xs={12} container spacing={2} alignItems="center" style={{ display: 'flex' }}>
                    {onEditClick && (
                        <Button onClick={onEditClick}>
                            Edit
                        </Button>
                    )}
                    <NavLink className="teamItemNavlink" to={`${Routes.Teams}/${team._id}`}>
                        <Button color="primary" variant="contained">
                            Open
                        </Button>
                    </NavLink>
                </Grid>
            </Grid>
        </Paper>
    </Box>
)
