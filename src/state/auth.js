import axios from 'axios'
import { SIGN_IN_URL, SIGN_UP_URL, RESET_PASSWORD_URL, REFRESH_TOKEN_URL } from '../consts/firebase'
import { circuralProgress} from './fullScreenCircuralProgress'
import { addSnackBar } from './snackbars'

const SAVE_USER = 'auth/SAVE_USER'
const LOG_OUT = 'auth/LOG_OUT'

const getSnackbarText = (string) => {
    switch (string) {
        case 'EMAIL_EXISTS':
            return 'Do tego maila jest już przypisany użytkownik'
            case 'OPERATION_NOT_ALLOWED':
                return 'To hasło jest niedozwolone'
            case 'EMAIL_NOT_FOUND':
                return 'Złe hasło lub email'
            case 'INVALID_PASSWORD':
                return 'Złe hasło lub email'
            case 'USER_DISABLED':
                return 'To konto jest zablokowane'
            default: 
                return 'Coś poszło nie tak. Spróboj ponownie później'
    }
}

export const authRequest = (url, method = 'get', data = {}) => (dispatch, getState) => {

    const getUrlWithToken = () => {
        const idToken = getState().auth.idToken
        if (idToken) {
            return url.includes('?') ? url+'&auth=' + idToken : url+'?auth=' + idToken
        }
        return url
    }

    return axios({
        url: getUrlWithToken(),
        method,
        data
    })
    .catch(error => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken && error.response.statusText === 'Unauthorized')
            return dispatch(useRefreshTokenAsyncActionCreator(refreshToken))
                .then(() => {
                    return axios({
                        url: getUrlWithToken(),
                        method,
                        data
                    })
                })
                .catch((error) => {
                    dispatch(logOutActionCreator())
                    dispatch(addSnackBar('Twoja sesja wygasła, zaloguj się ponownie', 'red'))
                    return Promise.reject(error)
                })
        else{
            return Promise.reject(error)
        }
    })
}

export const registerAsyncActionCreator = (email, password) => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    axios.post(SIGN_UP_URL, {
        email,
        password
    })
    .then(response => {
        const {idToken, refreshToken, localId} = response.data
        dispatch(saveUserActionCreator(idToken, refreshToken, localId))
    })
    .catch(error => {
        const text = getSnackbarText(
            error.response.data && 
            error.response.data.error && 
            error.response.data.error.message
        )
        dispatch(addSnackBar(text, 'red'))
    })
    .finally(() => dispatch(circuralProgress.remove()))
}    

export const resetPasswordAsyncActionCreator = (email, success) => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    axios.post(RESET_PASSWORD_URL, {
        email,
        requestType: 'PASSWORD_RESET'
    })
    .then(() => {
        dispatch(addSnackBar('Sprawdź swojego maila!'))
        success()
    })
    .catch(() => {
        dispatch(addSnackBar('Użytkownik z tym emailem nie istnieje', 'red'))
    })
    .finally(() => dispatch(circuralProgress.remove()))
}

export const logInAsyncActionCreator = (email, password) => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    axios.post(SIGN_IN_URL, {
        email,
        password,
        returnSecureToken: true
    })
    .then(response => {
        const {idToken, refreshToken, localId} = response.data
        dispatch(saveUserActionCreator(idToken, refreshToken, localId))
    })
    .catch(error => {
        const text = getSnackbarText(
            error.response.data && 
            error.response.data.error && 
            error.response.data.error.message
        )
        dispatch(addSnackBar(text, 'red'))
    })
    .finally(() => dispatch(circuralProgress.remove()))
}

export const logOutActionCreator = () => {
    localStorage.removeItem('refreshToken')
    return {
        type: LOG_OUT
    }
}

const saveUserActionCreator = (idToken, refreshToken, userId) => {
    localStorage.setItem('refreshToken', refreshToken)
    return {
        type: SAVE_USER,
        idToken,
        userId
    }
}

export const autoLogInAsyncActionCreator = () => (dispatch, getState) => {
    const refreshToken = localStorage.getItem('refreshToken')
    //console.log(refreshToken)
    if (refreshToken) {
        dispatch(useRefreshTokenAsyncActionCreator(refreshToken))
    }
}

// osoba funkcja do uzycia refresh tokena, wysylamy nas refresh token, dostaniemy nowy ref. token
const useRefreshTokenAsyncActionCreator = refreshToken => (dispatch, getState) => {
    dispatch(circuralProgress.add())
        return axios.post(REFRESH_TOKEN_URL, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
        .then(response => {
            const {id_token, refresh_token, user_id} = response.data
            dispatch(saveUserActionCreator(id_token, refresh_token, user_id))
            return response
        })
        //.catch(() => { })
        .finally(() => dispatch(circuralProgress.remove()))
}

const InitalState = {
    isLogged: false,
    idToken: null,
    userId: null
}

const auth = (state = InitalState, action) => {
    switch(action.type) {
        case SAVE_USER:
            return {
                ...state,
                isLogged: true,
                idToken: action.idToken,
                userId: action.userId
            }
        case LOG_OUT:
            return {
                ...state,
                isLogged: false,
                idToken: null,
                userId: null
            }
        default:
            return state
    }
}

export default auth