import React from 'react'
import { inject, observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import { BugReport } from '../../services/bug-reports-service'
import { UserStore } from '../../stores/user-store'
import { BugReportsStore } from '../../stores/bug-reports-store'

interface BugReportItemProps {
    report: BugReport
    userStore?: UserStore
    bugReportsStore?: BugReportsStore
}

export const BugReportItem: React.FC<BugReportItemProps> = inject(
    UserStore.storeName,
    BugReportsStore.storeName,
)(observer(
    props => {
        const { report, userStore, bugReportsStore } = props
        const { removeBugReport } = bugReportsStore

        return (
            <Grid item xs={12}>
                <Paper>
                    <Box p={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={11} container spacing={2}>
                                <Grid item xs={9}>
                                    <h3>{report.title}</h3>
                                </Grid>

                                <Grid item xs={3}>
                                    <h3>/{report.page}</h3>
                                </Grid>
                            </Grid>

                            <Grid item xs={1} container justify="flex-end">
                                {userStore?.currentUser?.admin && (
                                    <IconButton onClick={() => removeBugReport(report._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                {report.description}
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
        )
    }
))
