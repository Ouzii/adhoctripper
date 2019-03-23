

const personalTripsReducer = (store = null, action) => {
    switch(action.type) {
        case 'SET_PERSONAL_TRIPS':
            return store = action.trips
        case 'UPDATE_PERSONAL_TRIPS':
            return store.map(trip => { return trip.id === action.trip.id ? action.trip : trip })
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

export default personalTripsReducer