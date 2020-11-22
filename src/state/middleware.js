import { Store } from "@material-ui/icons"

const asyncAction = () => (dispatch, getState) => {

    fetch('url')
    .then( () => {
        dispatch(actionCreator)
    })
}

Store.dispatch(asyncAction)

const actionCreator = () => ({type: 'add'})

const initialState = {

}

const testMiddleware = (state = initialState, action) => {
    switch (action.type) {

        default:
            return state
    }
}

export default testMiddleware