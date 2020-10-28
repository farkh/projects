import React from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import AppsIcon from '@material-ui/icons/Apps'
import ListIcon from '@material-ui/icons/List'

import { Routes } from '../../core/routes'
import { ProjectsStore } from '../../stores/projects-store'

import './sidebar.scss'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
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
    },
  }),
)

interface SidebarProps {
    sidebarExpanded: boolean
    onCollapseSidebar: () => void
    projectsStore?: ProjectsStore
}

export const Sidebar: React.FC<SidebarProps> = inject(
  ProjectsStore.storeName,
)(observer(
  props => {
    const { sidebarExpanded, onCollapseSidebar, projectsStore } = props
    const { projects, fetchProjects } = projectsStore
    const classes = useStyles()
    const theme = useTheme()

    React.useEffect(() => {
      if (!projects?.length) {
        fetchProjects()
      }
    }, [])

    return (
        <Drawer
            variant="permanent"
            className={classNames(classes.drawer, {
                [classes.drawerOpen]: sidebarExpanded,
                [classes.drawerClose]: !sidebarExpanded,
            })}
            classes={{
                paper: classNames({
                    [classes.drawerOpen]: sidebarExpanded,
                    [classes.drawerClose]: !sidebarExpanded,
                }),
            }}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={onCollapseSidebar}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>

            <Divider />

            <List>
                <NavLink onClick={onCollapseSidebar} className="navlink" to={Routes.Main}>
                    <ListItem button key={Routes.Main}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary={'Main'} />
                    </ListItem>
                </NavLink>

                <NavLink onClick={onCollapseSidebar} className="navlink" to={Routes.Projects}>
                    <ListItem button key={Routes.Projects}>
                        <ListItemIcon><AppsIcon /></ListItemIcon>
                        <ListItemText primary={'Projects'} />
                    </ListItem>
                </NavLink>

                <NavLink onClick={onCollapseSidebar} className="navlink" to={Routes.Projects}>
                    <ListItem button key={Routes.Tasks}>
                        <ListItemIcon><ListIcon /></ListItemIcon>
                        <ListItemText primary={'Tasks'} />
                    </ListItem>
                </NavLink>

                <Divider />

                {projects?.map(project => (
                  <NavLink
                    key={project._id}
                    className="navlink"
                    onClick={onCollapseSidebar}
                    to={`${Routes.Projects}/${project._id}`}
                  >
                    <ListItem button key={`${Routes.Projects}/${project._id}`}>
                      <ListItemIcon className="projectEmoji">
                        <div className="projectEmojiBg" style={{ backgroundColor: project.color }}>
                          {project.emoji}
                        </div>
                      </ListItemIcon>
                      <ListItemText primary={project.title} />
                    </ListItem>
                  </NavLink>
                ))}
            </List>
        </Drawer>
    )
  }
))
