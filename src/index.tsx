import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import { AuthStore } from './stores/auth-store'
import { TasksStore } from './stores/tasks-store'
import { ProjectsStore } from './stores/projects-store'
import { ActivityStore } from './stores/activity-store'

import { getStore } from './stores/stores-repository'
import { createStore } from './stores/store'

import App from './App'

import './index.css'

const startApp = (): void => {
  const store = createStore()

  getStore<AuthStore>(AuthStore.storeName).init(process.env?.REACT_APP_API_URI || '')
  getStore<TasksStore>(TasksStore.storeName).init(process.env?.REACT_APP_API_URI || '')
  getStore<ProjectsStore>(ProjectsStore.storeName).init(process.env?.REACT_APP_API_URI || '')
  getStore<ActivityStore>(ActivityStore.storeName).init(process.env?.REACT_APP_API_URI || '')

  ReactDOM.render(
    <Provider {...store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

startApp()
