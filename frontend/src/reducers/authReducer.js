

const authReducer = (store = JSON.parse(window.localStorage.getItem('loggedUser')), action) => {
    switch(action.type) {
        case 'SET_USER':
            return store = action.user
        default:
            return store
    }
}

export const setLoggedUser = (user) => {
    if (!user) {
        window.localStorage.removeItem('loggedUser')
    } else {
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
    }
    
    return async (dispatch) => {
        dispatch({
            type: 'SET_USER',
            user
        })
    }
}

export default authReducer