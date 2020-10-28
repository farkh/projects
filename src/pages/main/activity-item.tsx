import React from 'react'
import { inject, observer } from 'mobx-react'
import Grid from '@material-ui/core/Grid'

import { Activity, ActivityType } from '../../services/activity-service'
import { UserStore } from '../../stores/user-store'
import { Color } from '../../core/colors'

import './activity-item.scss'

const getActivityTypeLabel = (type: ActivityType): string => {
    switch (type) {
        case 'ADD_PROJECT':
            return 'Added project'
        case 'ADD_TASK':
            return 'Added task'
        case 'EDIT_PROJECT':
            return 'Edited project'
        case 'EDIT_TASK':
            return 'Edited task'
        case 'BEGIN_PROJECT':
            return 'Began project'
        case 'BEGIN_TASK':
            return 'Began task'
        case 'COMPLETE_PROJECT':
            return 'Completed project'
        case 'COMPLETE_TASK':
            return 'Completed task'
        case 'DELETE_PROJECT':
            return 'Deleted project'
        case 'DELETE_TASK':
            return 'Deleted task'
        default:
            return ''
    }
}

const getActivityTypeColor = (type: ActivityType): string => {
    switch (type) {
        case 'ADD_PROJECT':
        case 'ADD_TASK':
            return Color.Positive
        case 'DELETE_PROJECT':
        case 'DELETE_TASK':
            return Color.Negative
        case 'EDIT_PROJECT':
        case 'EDIT_TASK':
            return Color.Neutral
        case 'BEGIN_PROJECT':
        case 'BEGIN_TASK':
            return Color.SemiPositive
        default:
            return '#ffffff'
    }
}

interface ActivityItemProps {
    activity: Activity
    userStore?: UserStore
}

export const ActivityItem: React.FC<ActivityItemProps> = inject(
    UserStore.storeName,
)(observer(
    props => {
        const { activity, userStore } = props

        return (
            <Grid xs={12} container spacing={1} className="activityItem">
                <Grid item xs={2}>
                    <img className="activityUserAvatar" src={userStore?.currentUser?.avatar} alt="Avatar" />
                </Grid>

                <Grid item xs={10} container spacing={1}>
                    <Grid item xs={12}>
                        <p className="activityUserName">{userStore?.currentUser?.name}</p>
                    </Grid>

                    <Grid item xs={12}>
                        <p className="activityType" style={{ backgroundColor: getActivityTypeColor(activity.type) }}>
                            {getActivityTypeLabel(activity.type)}
                        </p>
                    </Grid>

                    <Grid item xs={12}>
                        <p className="activityObject">{activity.activity_object}</p>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
))
