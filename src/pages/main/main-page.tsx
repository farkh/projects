import React from 'react'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Hidden from '@material-ui/core/Hidden'

import { FavoriteProjects } from './favorite-projects'
import { CreateTaskInput } from './create-task-input'
import { TodayTasks } from './today-tasks'
import { Activities } from './activities'
import { UserStore } from '../../stores/user-store'
import { AuthStore } from '../../stores/auth-store'

interface MainPageProps {
    userStore?: UserStore
    authStore?: AuthStore
}

export const MainPage: React.FC<MainPageProps> = inject(
    UserStore.storeName,
    AuthStore.storeName,
)(observer(
    props => {
        return (
            <Grid container spacing={2} alignItems="flex-start" style={{ height: '100%' }}>
                <Grid item xs={12} md={9} container spacing={2}>
                    <CreateTaskInput />

                    <TodayTasks />

                    <Grid item xs={12}>
                        <FavoriteProjects />
                    </Grid>
                </Grid>

                <Hidden smDown>
                    <Grid item xs={12} md={3} style={{ height: '100%' }}>
                        <Activities />
                    </Grid>
                </Hidden>
            </Grid>
        )
    }
))

export default MainPage
