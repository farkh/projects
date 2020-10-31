import React from 'react'
import { inject, observer } from 'mobx-react'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'

import { ProjectItem } from './project-item'
import { EditProjectDialog } from './edit-project-dialog'
import { ProjectsStore } from '../../stores/projects-store'

import './projects-page.scss'

interface ProjectsPageProps {
    projectsStore?: ProjectsStore
}

export const ProjectsPage: React.FC<ProjectsPageProps> = inject(
    ProjectsStore.storeName,
)(observer(
    props => {
        const { projects, fetchProjects, editDialogOpen, setEditDialogOpen, setEditingProject, setDummyProject } = props.projectsStore

        React.useEffect(() => {
            fetchProjects()
        }, [])

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1>Projects</h1>
                </Grid>

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
                    onClick={() => {
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
            </Grid>
        )
    }
))

export default ProjectsPage
