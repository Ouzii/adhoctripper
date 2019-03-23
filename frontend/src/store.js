import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import authReducer from './reducers/authReducer'
import notificationReducer from './reducers/notificationReducer'
import sharedTripsReducer from './reducers/sharedTripsReducer'
import personalTripsReducer from './reducers/personalTripsReducer'


const reducer = combineReducers({
  loggedUser: authReducer,
  notification: notificationReducer,
  sharedTrips: sharedTripsReducer,
  personalTrips: personalTripsReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store
