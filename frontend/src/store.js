import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import authReducer from './reducers/authReducer';
import notificationReducer from './reducers/notificationReducer';


const reducer = combineReducers({
  loggedUser: authReducer,
  notification: notificationReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store
