

const sharedTripsReducer = (store = null, action) => {
    switch (action.type) {
        case 'SET_SHARED_TRIPS':
            return store = action.trips
        case 'ADD_TO_SHARED_TRIPS':
            store.push(action.trip)
            return store
        case 'REMOVE_FROM_SHARED_TRIPS':
            const newStore = store.filter(trip => trip.id !== action.trip.id)
            return newStore
        default:
            return store
    }
}

export const setSharedTrips = (trips) => {
    return async (dispatch) => {
        dispatch({
            type: 'SET_SHARED_TRIPS',
            trips
        })
    }
}

export const addToSharedTrips = (trip) => {
    return async (dispatch) => {
        dispatch({
            type: 'ADD_TO_SHARED_TRIPS',
            trip
        })
    }
}
export const removeFromSharedTrips = (trip) => {
    return async (dispatch) => {
        dispatch({
            type: 'REMOVE_FROM_SHARED_TRIPS',
            trip
        })
    }
}

export default sharedTripsReducer