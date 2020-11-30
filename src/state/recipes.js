//import axios from 'axios'
import { URL } from '../consts/firebase'
import { circuralProgress } from './fullScreenCircuralProgress'
import { addSnackBar} from './snackbars'
import mapObjectToArray from '../utilities/mapObjectToArray'
import { authRequest } from './auth'

const SAVE_RECIPES = 'recipes/SAVE_RECIPE'
const ERROR_ON_GET = 'recipes/ERROR_ON_GET'

export const addRecipeAsyncActionCreator = form => (dispatch, getState) => {
    const userId = getState().auth.userId
    dispatch(circuralProgress.add())
    return dispatch(authRequest(URL + 'users/' + userId + '/recipes.json', 'post', form))
        .then(() => {
            dispatch(circuralProgress.remove())
            dispatch(addSnackBar('Przepis dodano prawidłowo'))
        })
        .catch(() => {
            dispatch(circuralProgress.remove())
            dispatch(addSnackBar('Dodanie przepisu niepowiodło się, spróboj ponownie później', 'red'))
            return Promise.reject()
        })
}

export const getRecipesAsyncActionCreator = () => (dispatch, getState) => {
    const userId = getState().auth.userId
    dispatch(circuralProgress.add())
    dispatch(authRequest(URL + 'users/' + userId + '/recipes.json'))
        .then((response) => {
            const mappedData = mapObjectToArray(response.data)
            dispatch(saveRecipesActionCreator(mappedData))
            dispatch(circuralProgress.remove())
        })
        .catch(() => {
            dispatch(circuralProgress.remove()) 
            dispatch(errorOnGetRecipesActionCreator())
        })
}

export const deleteRecipeAsyncActionCreator = (key, success, error) => (dispatch, getState) => {
    const userId = getState().auth.userId
    dispatch(circuralProgress.add())
    dispatch(authRequest(URL + 'users/' + userId + '/recipes/' + key + '.json', 'delete'))
        .then(() => {
            const recipes = getState().recipes.recipes
            const recipesAfterDelete = recipes.filter(recipe => recipe.key !== key)
            dispatch(saveRecipesActionCreator(recipesAfterDelete))
            dispatch(addSnackBar('Przepis usunięto prawidłowo'))
            dispatch(circuralProgress.remove())
            success()
        })
        .catch(() => {
            dispatch(addSnackBar('Usuwanie nie powiodło się, spróboj ponowie później', 'red'))
            dispatch(circuralProgress.remove())
            error()
        })
}

export const editRecipeAsyncActionCreator = (form, key, success, error) => (dispatch, getState) => {
    const userId = getState().auth.userId
    dispatch(circuralProgress.add())
    dispatch(authRequest(URL + 'users/' + userId + '/recipes/' + key + '.json', 'patch', form))
        .then(() => {
            const recipes = getState().recipes.recipes
            const recipesAfterEdit = recipes.map(recipe => {
                if(recipe.key === key){
                return form
                }
                return recipe
            })
            dispatch(saveRecipesActionCreator(recipesAfterEdit))
            dispatch(addSnackBar('Przepis edytowano.'))
            dispatch(circuralProgress.remove())
            success()
        })
        .catch(() => {
            dispatch(addSnackBar('Edytowanie nie powiodło się, spróboj ponowie później', 'red'))
            dispatch(circuralProgress.remove())
            error()
        })
}

const saveRecipesActionCreator = recipes => {
    // const numbers = [1,2,3]
    // console.log(numbers.map(el => el * 2))
    // console.log(numbers.reduce((red, el)=> [...red, el*2],[]))
    // reduce, wrzucamy kolejny element przy cyklu i dodajemy to co juz jest ...red
    const suggestions = recipes.reduce((red, el) => [...red, ...el.ingredients] ,[])
    .reduce((red, el) => red.includes(el.ingredient) ? red : [...red, el.ingredient],[])
    //.map(el => el.ingredient) aby ingredient sie nie duplikowal uzywamy reduce jeszcze raz
    //console.log(suggestions)
    return {
        type: SAVE_RECIPES,
        recipes,
        suggestions
    }   
}

const errorOnGetRecipesActionCreator = () => ({
    type: ERROR_ON_GET
})

const initialState = {
    recipes: [],
    suggestions: [],
    isError: false
}
	
const recipes = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_RECIPES:
        return {
            ...state,
            isError: false,
            recipes: action.recipes,
            suggestions: action.suggestions
        }
        case ERROR_ON_GET:
            return {
                ...state,
                isError: true
            }

        default:
            return state
    }
}

export default recipes