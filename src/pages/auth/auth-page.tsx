import React from 'react'
import { inject, observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { AuthStore, AuthType } from '../../stores/auth-store'
import { UserStore } from '../../stores/user-store'
import { Routes } from '../../core/routes'

import './auth-page.scss'

interface AuthPageProps {
    authStore?: AuthStore
    userStore?: UserStore
}

export const AuthPage: React.FC<AuthPageProps> = inject(
    AuthStore.storeName,
    UserStore.storeName,
)(observer(
    props => {
        const { userData, setUserData, authType, setAuthType, errorMessage, login, register } = props.authStore
        const { loggedIn } = props.userStore

        const handleAuth = (): void => {
            if (authType === AuthType.Login) login()
            else register()
        }

        return (
            <Grid container justify="center" alignItems="center" style={{ height: '100%' }}>
                {loggedIn && <Redirect to={Routes.Main} />}
                <Paper style={{ width: 460 }}>
                    <Box p={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {/* TODO: add form validation */}
                                <TextField
                                    id="authEmailInput"
                                    name="email"
                                    fullWidth
                                    value={userData?.email}
                                    variant="outlined"
                                    type="email"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ email: e.target.value })}
                                    label="Email"
                                    placeholder="Enter email"
                                />
                            </Grid>

                            {authType === AuthType.Register && (
                                <Grid item xs={12}>
                                    <TextField
                                        id="authNameInput"
                                        name="name"
                                        fullWidth
                                        value={userData?.name}
                                        variant="outlined"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ name: e.target.value })}
                                        label="Name"
                                        placeholder="Enter name"
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    id="authPasswordInput"
                                    name="password"
                                    fullWidth
                                    value={userData?.password}
                                    type="password"
                                    variant="outlined"
                                    error={!!errorMessage?.length}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ password: e.target.value })}
                                    label="Password"
                                />
                                {errorMessage?.length > 0 && (
                                    <p className="authErrorMessage">{errorMessage}</p>
                                )}
                            </Grid>

                            {authType === AuthType.Register && (
                                <Grid item xs={12}>
                                    <TextField
                                        id="authPasswordConfirmationInput"
                                        name="passwordConfirmation"
                                        fullWidth
                                        value={userData?.passwordConfirmation}
                                        type="password"
                                        variant="outlined"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ passwordConfirmation: e.target.value })}
                                        label="Confirm password"
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    color="primary"
                                    variant="contained"
                                    onClick={handleAuth}
                                >
                                    {authType === AuthType.Login && 'Login'}
                                    {authType === AuthType.Register && 'Sign up'}
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    onClick={() => {
                                        if (authType === AuthType.Login) setAuthType(AuthType.Register)
                                        else setAuthType(AuthType.Login)
                                    }}
                                >
                                    {authType === AuthType.Login && 'Not a member? Create account now'}
                                    {authType === AuthType.Register && 'Already have an account? Log in now'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
        )
    }
))

export default AuthPage
