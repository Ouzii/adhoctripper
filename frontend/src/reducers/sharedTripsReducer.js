
const sharedTripsReducer = (store = JSON.parse(window.localStorage.getItem('sharedTrips')), action) => {
    switch (action.type) {
        case 'SET_SHARED_TRIPS':
            return store = action.trips
        case 'ADD_TO_SHARED_TRIPS':
            store.push(action.trip)
            window.localStorage.setItem('sharedTrips', JSON.stringify(store))
            return store
        case 'REMOVE_FROM_SHARED_TRIPS':
            const newStore = store.filter(trip => trip.id !== action.trip.id)
            window.localStorage.setItem('sharedTrips', JSON.stringify(newStore))
            return newStore
        default:
            return store
    }
}

export const setSharedTrips = (trips) => {
    window.localStorage.setItem('sharedTrips', JSON.stringify(trips))
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