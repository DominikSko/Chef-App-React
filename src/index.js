import React from 'react'
import ReacDOM from 'react-dom'

import { Provider } from 'react-redux'
import { store } from './store'

import { MuiThemeProvider} from '@material-ui/core/styles'
import theme from './theme.js'

import App from './App'

import {addSnackBar} from './state/snackbars'
import './state/zapytania'

window.snack = (text, color, time) => store.dispatch(addSnackBar(text, color, time))

ReacDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
        <App />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
)