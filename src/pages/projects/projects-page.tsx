import React from 'react'
import { inject, observer } from 'mobx-react'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'

import { ProjectItem } from './project-item'
import { EditProjectDialog } from './edit-project-dialog'
import { ProjectsStore } from '../../stores/projects-store'

interface ProjectsPageProps {
    projectsStore?: ProjectsStore
}

export const ProjectsPage: React.FC<ProjectsPageProps> = inject(
    ProjectsStore.storeName,
)(observer(
    props => {
        const { projects, fetchProjects, editDialogOpen, setEditDialogOpen, setEditingProject, reset } = props.projectsStore

        React.useEffect(() => {
            fetchProjects()

            // return () => {
                // reset()
            // }
        }, [])

        return (
            <Grid container spacing={2}>
                <h1>Projects</h1>

                <Grid item xs={12} container spacing={2}>
                    {projects?.map(project => (
                        <Grid key={project._id} item xs={12} sm={6} md={4}>
                            <ProjectItem
                                project={project}
                                onEditClick={() => {
                                    setEditingProject(project)
                                    setEditDialogOpen(true)
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Fab
                    color="primary"
                    onClick={() => setEditDialogOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        zIndex: 2,
                    }}
                >
                    <AddIcon />
                </Fab>

                {editDialogOpen && (
                    <EditProjectDialog onClose={() => setEditDialogOpen(false)} />
                )}
            </Grid>
        )
    }
))

export default ProjectsPage
