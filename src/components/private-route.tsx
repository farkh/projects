import React from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

import { UserStore } from '../stores/user-store'
import { Routes } from '../core/routes'

interface PrivateRouteProps extends RouteProps {
    userStore?: UserStore
}

export const PrivateRoute: React.FC<PrivateRouteProps> = inject(
    UserStore.storeName,
)(observer(
    props => {
        const { userStore, ...other } = props

        if (userStore?.loggedIn) return <Route {...other} />

        return <Redirect to={Routes.Auth} />
    }
))
