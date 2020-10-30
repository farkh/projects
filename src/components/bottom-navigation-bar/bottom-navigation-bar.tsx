import React from 'react'
import { NavLink } from 'react-router-dom'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import HomeIcon from '@material-ui/icons/Home'
import AppsIcon from '@material-ui/icons/Apps'
import ListIcon from '@material-ui/icons/List'
import BugReportIcon from '@material-ui/icons/BugReport'

import { Routes } from '../../core/routes'
import './bottom-navigation-bar.scss'

export const BottomNavigationBar: React.FC = () => {
    const [active, setActive] = React.useState<number>(0)

    return (
        <BottomNavigation
            showLabels
            className="bottomNavigation"
            value={active}
            onChange={(_: React.ChangeEvent<any>, newValue: number) => setActive(newValue)}
        >
            <BottomNavigationAction
                component={NavLink}
                to={Routes.Main}
                label="Main"
                icon={<HomeIcon />}
            />
            <BottomNavigationAction
                component={NavLink}
                to={Routes.Projects}
                label="Projects"
                icon={<AppsIcon />}
            />
            <BottomNavigationAction
                disabled
                component={NavLink}
                to={Routes.Tasks}
                label="Tasks"
                icon={<ListIcon />}
            />
            <BottomNavigationAction
                component={NavLink}
                to={Routes.BugReports}
                label="Reports"
                icon={<BugReportIcon />}
            />
        </BottomNavigation>
    )
}
