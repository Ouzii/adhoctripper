
const sharedTripsReducer = (store = JSON.parse(window.localStorage.getItem('sharedTrips')), action) => {
    switch (action.type) {
        case 'SET_SHARED_TRIPS':
        const sharedTrips = action.trips.sort((a, b) => {
            if (new Date(a.saved) > new Date(b.saved)) {
              return -1
            } else if (new Date(a.saved) < new Date(b.saved)) {
              return 1
            } else {
              return 0
            }
          })
        window.localStorage.setItem('sharedTrips', JSON.stringify(sharedTrips))
            return sharedTrips
        case 'ADD_TO_SHARED_TRIPS':
            const newSharedTrips = store.slice()
            newSharedTrips.push(action.trip)
            const sortedNewSharedTrips = newSharedTrips.sort((a, b) => {
                if (new Date(a.saved) > new Date(b.saved)) {
                  return -1
                } else if (new Date(a.saved) < new Date(b.saved)) {
                  return 1
                } else {
                  return 0
                }
              })
            window.localStorage.setItem('sharedTrips', JSON.stringify(sortedNewSharedTrips))
            return sortedNewSharedTrips
        case 'REMOVE_FROM_SHARED_TRIPS':
            const newStore = store.filter(trip => trip.id !== action.trip.id)
            const sortedNewStore = newStore.sort((a, b) => {
                if (new Date(a.saved) > new Date(b.saved)) {
                  return -1
                } else if (new Date(a.saved) < new Date(b.saved)) {
                  return 1
                } else {
                  return 0
                }
              })
            window.localStorage.setItem('sharedTrips', JSON.stringify(sortedNewStore))
            return sortedNewStore
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