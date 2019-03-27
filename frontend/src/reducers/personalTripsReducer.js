

const personalTripsReducer = (store = JSON.parse(window.localStorage.getItem('personalTrips')), action) => {
  switch (action.type) {
    case 'SET_PERSONAL_TRIPS':
      const personalTrips = action.trips.sort((a, b) => {
        if (new Date(a.saved) > new Date(b.saved)) {
          return -1
        } else if (new Date(a.saved) < new Date(b.saved)) {
          return 1
        } else {
          return 0
        }
      })
      window.localStorage.setItem('personalTrips', JSON.stringify(personalTrips))
      return personalTrips
    case 'UPDATE_PERSONAL_TRIPS':
      const updatedTrips = store.map(trip => { return trip.id === action.trip.id ? action.trip : trip })
      const sortedUpdatedTrips = updatedTrips.sort((a, b) => {
        if (new Date(a.saved) > new Date(b.saved)) {
          return -1
        } else if (new Date(a.saved) < new Date(b.saved)) {
          return 1
        } else {
          return 0
        }
      })
      window.localStorage.setItem('personalTrips', JSON.stringify(sortedUpdatedTrips))
      return sortedUpdatedTrips
    case 'CONCAT_TO_PERSONAL_TRIPS':
      const oldPersonalTrips = store.slice()
      const newPersonalTrips = action.trips
      const sortedNewPersonalTrips = oldPersonalTrips.concat(newPersonalTrips).sort((a, b) => {
        if (new Date(a.saved) > new Date(b.saved)) {
          return -1
        } else if (new Date(a.saved) < new Date(b.saved)) {
          return 1
        } else {
          return 0
        }
      })
      window.localStorage.setItem('personalTrips', JSON.stringify(sortedNewPersonalTrips))
      return sortedNewPersonalTrips
    case 'REMOVE_FROM_PERSONAL_TRIPS':
      const removedFromTrips = store.filter(trip => trip.id !== action.trip.id)
      const sortedRemovedFromTrips = removedFromTrips.sort((a, b) => {
        if (new Date(a.saved) > new Date(b.saved)) {
          return -1
        } else if (new Date(a.saved) < new Date(b.saved)) {
          return 1
        } else {
          return 0
        }
      })
      window.localStorage.setItem('personalTrips', JSON.stringify(sortedRemovedFromTrips))
      return sortedRemovedFromTrips
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

export const concatToPersonalTrips = (trips) => {
  return async (dispatch) => {
      dispatch({
          type: 'CONCAT_TO_PERSONAL_TRIPS',
          trips
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