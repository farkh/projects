import { observable, action } from 'mobx'
import { Theme, createMuiTheme } from '@material-ui/core/styles'
import { store } from './stores-repository'

export enum ThemeMode {
    Dark = 'dark',
    Light = 'light',
}

const mode = localStorage.getItem('theme')

@store
export class ThemeStore {
    static storeName: string = 'themeStore'

    @observable
    mode: ThemeMode = mode !== null ? mode as ThemeMode : ThemeMode.Light

    private darkTheme: Theme = createMuiTheme({
        palette: {
            type: ThemeMode.Dark,
            secondary: {
                main: '#ffffff',
            },
        },
    });

    private lightTheme: Theme = createMuiTheme({
        palette: {
            type: ThemeMode.Light,
        },
    });
    
    @observable
    theme: Theme = mode !== null && mode === ThemeMode.Dark ? this.darkTheme : this.lightTheme

    @action
    toggleDarkMode = (): void => {
        if (this.mode === ThemeMode.Light) {
            this.mode = ThemeMode.Dark
            this.theme = this.darkTheme
            localStorage.setItem('theme', ThemeMode.Dark)
        } else {
            this.mode = ThemeMode.Light
            this.theme = this.lightTheme
            localStorage.setItem('theme', ThemeMode.Light)
        }
    }
}
