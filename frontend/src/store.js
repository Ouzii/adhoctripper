import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import authReducer from './reducers/authReducer';


const reducer = combineReducers({
  loggedUser: authReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store
