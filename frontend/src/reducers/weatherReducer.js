
const weatherReducer = (store = null, action) => {
    switch (action.type) {
        case 'SET_WEATHER':
            return action.weather
        default:
            return store
    }
}

export const setWeather = (weather) => {
    return async (dispatch) => {
        dispatch({
            type: 'SET_WEATHER',
            weather: weather
        })
    }
}

export default weatherReducer