import React from 'react'
import { inject, observer } from 'mobx-react'
import Fab from '@material-ui/core/Fab'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import AddIcon from '@material-ui/icons/Add'

import { UserStore } from '../../stores/user-store'
import { BugReportsStore } from '../../stores/bug-reports-store'
import { Page } from '../../services/bug-reports-service'
import { BugReportItem } from './bug-report-item'
import { AddBugReportDialog } from './add-bug-report-dialog'

import './bug-reports-page.scss'

interface SelectOption {
    value: string
    label: string
}

export const getPageOpts = (): SelectOption[] =>
    Object.keys(Page).map(key => ({
        value: Page[key],
        label: key,
    }))

interface BugReportsPageProps {
    userStore?: UserStore
    bugReportsStore?: BugReportsStore
}

export const BugReportsPage: React.FC<BugReportsPageProps> = inject(
    UserStore.storeName,
    BugReportsStore.storeName,
)(observer(
    props => {
        const [addDialogOpen, setAddDialogOpen] = React.useState<boolean>(false)
        const { bugReportsStore, userStore } = props
        const { bugReports, fetchBugReports, fetchBugReportsByPage, pageFilter, setPageFilter } = bugReportsStore
        const { currentUser } = userStore

        React.useEffect(() => {
            fetchBugReports()
        }, [])
        
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1>Bug reports</h1>
                </Grid>

                {currentUser.admin && (
                    <Grid item xs={12}>
                        <Paper>
                            <Box p={2}>
                                <Grid container spacing={2} alignItems="flex-end">
                                    <Grid item xs={12} md={9}>
                                        <FormControl fullWidth>
                                            <InputLabel id="page-select-label">Page</InputLabel>
                                            <Select
                                                id="page-select-label"
                                                fullWidth
                                                label="Project"
                                                value={pageFilter}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPageFilter(e.target.value as Page)}
                                            >
                                                {getPageOpts().map(opt => (
                                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6} md={3} container justify="flex-end">
                                        <Button
                                            disabled={!pageFilter}
                                            onClick={() => setPageFilter(null)}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            disabled={!pageFilter}
                                            style={{ marginLeft: 8 }}
                                            onClick={fetchBugReportsByPage}
                                        >
                                            Apply
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                )}

                <Grid item xs={12} container spacing={2}>
                    {bugReports?.map(report => (
                        <BugReportItem report={report} />
                    ))}
                </Grid>

                <Fab
                    color="primary"
                    onClick={() => setAddDialogOpen(true)}
                    className="fab"
                >
                    <AddIcon />
                </Fab>

                {addDialogOpen && (
                    <AddBugReportDialog onClose={() => setAddDialogOpen(false)} />
                )}
            </Grid>
        )
    }
))

export default BugReportsPage
