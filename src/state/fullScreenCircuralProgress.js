const ADD_CIRCURAL = 'fullScreenCircuralProgress/ADD_CIRCURAL'
const REMOVE_CIRCURAL = 'fullScreenCircuralProgress/REMOVE_CIRCURAL'

const addCircuralActionCreator = () => ({type: ADD_CIRCURAL})
const removeCircuralActionCreator = () => ({type: REMOVE_CIRCURAL})

export const circuralProgress = {
    add: addCircuralActionCreator,
    remove: removeCircuralActionCreator
}

const initalState = {
    circurals: []
}

// export default (state = initalState, action) => {
//     switch (action.type) {
//         case ADD_CIRCURAL:
//             return {
//                 ...state,
//                 circurals: [...state.circurals, true]
//             }
//         case REMOVE_CIRCURAL:
//             return {
//                 ...state,
//                 circurals: state.circurals.filter((el, index) => index !== 0)
//             }
//         default:
//             return state
//     }
// }

const fullScreenCircuralProgres = (state = initalState, action) => {
    switch (action.type) {
        case ADD_CIRCURAL:
            return {
                ...state,
                circurals: [...state.circurals, true]
            }
        case REMOVE_CIRCURAL:
            return {
                ...state,
                circurals: state.circurals.filter((el, index) => index !== 0)
            } 
        default:
            return state
    }
}

export default fullScreenCircuralProgres