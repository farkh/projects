import React from 'react'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { ActivityItem } from './activity-item'
import { ActivityStore } from '../../stores/activity-store'
import { Activity, ActivityType } from '../../services/activity-service'

interface ActivitiesProps {
    activityStore?: ActivityStore
}

export const Activities: React.FC<ActivitiesProps> = inject(
    ActivityStore.storeName,
)(observer(
    props => {
        const { activities, fetchPastWeekActivities } = props.activityStore

        React.useEffect(() => {
            fetchPastWeekActivities()
        }, [])

        return (
            <Paper style={{ height: '100%', overflow: 'hidden' }}>
                <Box p={2} style={{ maxHeight: '100%', overflow: 'hidden', overflowY: 'auto', marginRight: -17 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h2>Recent activities</h2>
                            {!activities?.length && <p style={{ textAlign: 'center' }}>No activities yet</p>}
                        </Grid>

                        {activities?.map(activity => (
                            <ActivityItem key={activity._id} activity={activity} />
                        ))}
                    </Grid>
                </Box>
            </Paper>
        )
    }
))
