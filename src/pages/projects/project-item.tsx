import React from 'react'
import { NavLink } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { IconButton } from '@material-ui/core'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import StarIcon from '@material-ui/icons/Star'

import { Project } from '../../services/projects-serivce'
import { Routes } from '../../core/routes'
import { ProjectsStore } from '../../stores/projects-store'

import './project-item.scss'

interface ProjectItemProps {
    project: Project
    onEditClick?: () => void
    projectsStore?: ProjectsStore
}

export const ProjectItem: React.FC<ProjectItemProps> = inject(
    ProjectsStore.storeName,
)(observer(
    props => {
        const { project, onEditClick, projectsStore } = props

        return (
            <Box pb={1} className="projectItem">
                <Paper className="projectItemContent" elevation={3}>
                    <Paper elevation={2} className="projectColor" style={{ backgroundColor: project.color }}>
                        {project.emoji}
                    </Paper>
                    <Box className="favoriteButton">
                        <IconButton
                            onClick={() => {
                                projectsStore?.updateProject({ ...project, favorite: !project.favorite })
                            }}
                        >
                            {project.favorite ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                    </Box>
                    <Box p={1}>
                        <Grid container spacing={2} justify="space-between">
                            <Grid item xs={12}>
                                <p className="projectTitle">{project.title}</p>
                            </Grid>

                            <Grid item xs={12} container style={{ display: 'flex' }}>
                                {onEditClick && (
                                    <Button onClick={onEditClick}>
                                        Edit
                                    </Button>
                                )}
                                <NavLink className="projectItemNavlink" to={`${Routes.Projects}/${project._id}`}>
                                    <Button color="primary" variant="contained">
                                        Open
                                    </Button>
                                </NavLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        )
    }
))
