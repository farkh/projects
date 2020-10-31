import React, { lazy, Suspense } from 'react'
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'

import { ThemeStore } from './stores/theme-store'
import { AuthStore } from './stores/auth-store'
import { AppStore } from './stores/app-store'
import { Routes } from './core/routes'

import { PrivateRoute } from './components/private-route'
import { Spinner } from './components/spinner/spinner'
import { AppContainer } from './components/app-container/app-container'

const AuthPage = lazy(() => import('./pages/auth/auth-page'))
const MainPage = lazy(() => import('./pages/main/main-page'))
const ProjectPage = lazy(() => import('./pages/project/project-page'))
const ProjectsPage = lazy(() => import('./pages/projects/projects-page'))
const BugReportsPage = lazy(() => import('./pages/bug-reports/bug-reports-page'))
const TeamsPage = lazy(() => import('./pages/teams/teams-page'))
const TeamPage = lazy(() => import('./pages/team/team-page'))

interface AppProps {
  appStore?: AppStore
  authStore?: AuthStore
  themeStore?: ThemeStore
}

@inject(AppStore.storeName)
@inject(AuthStore.storeName)
@inject(ThemeStore.storeName)
@observer
export class App extends React.Component<AppProps> {
  componentWillMount() {
    this.props.authStore?.pullUser()
  }

  render() {
    const { themeStore, appStore } = this.props

    if (!appStore.appLoaded) return <Spinner />

    return (
      <Suspense fallback={<Spinner />}>
        <ThemeProvider theme={themeStore?.theme}>
          <CssBaseline />

          {appStore?.loading && <Spinner />}

          <BrowserRouter>
            <Switch>
              <Route exact path={Routes.Auth} component={AuthPage} />
              <Redirect exact from="/" to={Routes.Main} />

              <AppContainer>
                <PrivateRoute exact path={Routes.Main} component={MainPage} />
                <PrivateRoute exact path={Routes.Projects} component={ProjectsPage} />
                <PrivateRoute exact path={`${Routes.Projects}/:id`} component={ProjectPage} />
                <PrivateRoute exact path={Routes.BugReports} component={BugReportsPage} />
                <PrivateRoute exact path={Routes.Teams} component={TeamsPage} />
                <PrivateRoute exact path={`${Routes.Teams}/:id`} component={TeamPage} />
              </AppContainer>
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </Suspense>
    )
  }
}

export default App
