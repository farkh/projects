import React from 'react'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

import { UserStore } from '../../stores/user-store'
import { AuthStore } from '../../stores/auth-store'

const drawerWidth: number = 240
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
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
    hide: {
        display: 'none',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: '50%',
    },
  }),
)

interface NavbarProps {
    sidebarExpanded: boolean
    onExpandSidebar: () => void
    authStore?: AuthStore
    userStore?: UserStore
}

export const Navbar: React.FC<NavbarProps> = inject(
    AuthStore.storeName,
    UserStore.storeName,
)(observer(
    props => {
        const { sidebarExpanded, onExpandSidebar, authStore, userStore } = props
        const classes = useStyles()
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
        const accountMenuOpen = Boolean(anchorEl)

        return (
            <div className={classes.root}>
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: sidebarExpanded,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={onExpandSidebar}
                            className={classNames(classes.menuButton, {
                                [classes.hide]: sidebarExpanded,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            React App
                        </Typography>
                        {userStore?.loggedIn && (
                            <div>
                                <IconButton
                                    aria-label="account"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
                                    color="inherit"
                                >
                                    <img
                                        className={classes.avatar}
                                        src={userStore?.currentUser?.avatar}
                                        alt="avatar"
                                    />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={accountMenuOpen}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    <MenuItem>{userStore?.currentUser?.name}</MenuItem>
                                    <MenuItem onClick={authStore?.logout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
))
