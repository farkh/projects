import React from 'react'
import { inject, observer } from 'mobx-react'
import Grid from '@material-ui/core/Grid'

import { ProjectItem } from '../projects/project-item'
import { ProjectsStore } from '../../stores/projects-store'

interface FavoriteProjectsProps {
    projectsStore?: ProjectsStore
}

export const FavoriteProjects: React.FC<FavoriteProjectsProps> = inject(
    ProjectsStore.storeName,
)(observer(
    props => {
        const { projectsStore } = props
        const { favoriteProjects, fetchFavoriteProjects } = projectsStore

        React.useEffect(() => {
            fetchFavoriteProjects()
        }, [])

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2>Favorite projects</h2>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                    {favoriteProjects?.map(project => (
                        <Grid key={project._id} item xs={12} sm={6} md={4}>
                            <ProjectItem project={project} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        )
    }
))
