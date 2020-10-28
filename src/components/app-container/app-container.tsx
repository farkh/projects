import React from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Navbar } from '../navbar/navbar'
import { Sidebar } from '../sidebar/sidebar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      overflowY: 'auto',
      marginRight: -17,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      maxWidth: 'unset',
    },
  }),
);

interface AppContainerProps {
    children: React.ReactNode | React.ReactNode[]
}

export const AppContainer: React.FC<AppContainerProps> = props => {
    const [sidebarExpanded, setSidebarExpanded] = React.useState<boolean>(false)
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Navbar
                sidebarExpanded={sidebarExpanded}
                onExpandSidebar={() => setSidebarExpanded(true)}
            />
            <Sidebar
                sidebarExpanded={sidebarExpanded}
                onCollapseSidebar={() => setSidebarExpanded(false)}
            />
            <Container className={classes.content}>
                <div className={classes.toolbar} />
                <Box p={2} style={{ height: 'calc(100% - 64px)' }}>
                    {props.children}
                </Box>
            </Container>
        </div>
    )
}
