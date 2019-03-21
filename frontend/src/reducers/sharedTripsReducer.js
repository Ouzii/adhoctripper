

const sharedTripsReducer = (store = null, action) => {
    switch(action.type) {
        case 'SET_SHARED_TRIPS':
            return store = action.trips
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

export default sharedTripsReducer