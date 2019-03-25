

const personalTripsReducer = (store = JSON.parse(window.localStorage.getItem('personalTrips')), action) => {
    switch (action.type) {
        case 'SET_PERSONAL_TRIPS':
            window.localStorage.setItem('personalTrips', JSON.stringify(action.trips))
            return action.trips
        case 'UPDATE_PERSONAL_TRIPS':
            const updatedTrips = store.map(trip => { return trip.id === action.trip.id ? action.trip : trip })
            window.localStorage.setItem('personalTrips', JSON.stringify(updatedTrips))
            return updatedTrips
        case 'REMOVE_FROM_PERSONAL_TRIPS':
            const removedFromTrips = store.filter(trip => trip.id !== action.trip.id)
            window.localStorage.setItem('personalTrips', JSON.stringify(removedFromTrips))
            return removedFromTrips
        default:
            return store
    }
}

export const setPersonalTrips = (trips) => {
    return async (dispatch) => {
        dispatch({
            type: 'SET_PERSONAL_TRIPS',
            trips
        })
    }
}

export const updatePersonalTrips = (trip) => {
    return async (dispatch) => {
        dispatch({
            type: 'UPDATE_PERSONAL_TRIPS',
            trip
        })
    }
}

export const removeFromPersonalTrips = (trip) => {
    return async (dispatch) => {
        dispatch({
            type: 'REMOVE_FROM_PERSONAL_TRIPS',
            trip
        })
    }
}

export default personalTripsReducer