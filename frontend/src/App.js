import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux'
import HeaderWithRouter from './components/Header';
import SwipeableRoutes from 'react-swipeable-routes';
import { Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisteringPage from './components/RegisteringPage';
import { setLoggedUser } from './reducers/authReducer';
import { setSharedTrips } from './reducers/sharedTripsReducer'
import { setPersonalTrips, concatToPersonalTrips } from './reducers/personalTripsReducer'
import NewTripPage from './components/NewTripPage';
import { saveOfflineTrips } from './components/SaveOfflineTrips'
import Notification from './components/Notification';
import UserPage from './components/UserPage';
import authService from './services/auth'
import BrowsingPage from './components/BrowsingPage';
import tripService from './services/trip';
import ShowRoute from './components/ShowRoute';
import PersonalTripsPage from './components/PersonalTripsPage';
import accountService from './services/account'
import ModifyAccountInfo from './components/ModifyAccountInfo';
import axios from 'axios'
import weatherService from './services/weather'
import { setWeather } from './reducers/weatherReducer'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
    tripService.checkIfTokenInLocal()
  }

  async componentDidMount() {
    window.addEventListener('resize', this.reloadPage.bind(this))
    const cached = JSON.parse(window.localStorage.getItem('cached_requests'))
    if (cached && cached.length > 0) {
      cached.forEach(async req => {
        switch (req.method) {
          case 'get':

            await axios.get(req.url, req.data, { headers: req.headers })
            break
          case 'post':
            await axios.post(req.url, req.data, { headers: req.headers })
            break
          case 'put':
            await axios.put(req.url, req.data, { headers: req.headers })
            break
          case 'delete':
            await axios.delete(req.url, { data: req.data })
            break
          default:
            break
        }
        req.sent = true
      })
      const unsentRequests = cached.filter(req => {
        return req.sent === false
      })
      window.localStorage.setItem('cached_requests', JSON.stringify(unsentRequests))
      console.log("Cache sent")
    } else {
      console.log("No cached requests")
      window.localStorage.setItem('cached_requests', JSON.stringify([]))
    }

    const savedOfflineTrips = JSON.parse(window.localStorage.getItem('savedOfflineTrips'))
    if (savedOfflineTrips && savedOfflineTrips.length > 0) {
      const trips = await saveOfflineTrips()
      this.props.concatToPersonalTrips(trips)

    }

    const token = JSON.parse(window.localStorage.getItem('id_token'))
    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    if (token && !authService.isTokenExpired(token) && user) {
      await this.props.setLoggedUser(user)
      await authService.setToken(token)
      await tripService.setToken(token)
      await accountService.setToken(token)
    } else {
      window.localStorage.removeItem('id_token')
      window.localStorage.removeItem('loggedUser')
    }

    if (!navigator.onLine) {
      await this.props.setSharedTrips(JSON.parse(window.localStorage.getItem('sharedTrips')))
      await this.props.setPersonalTrips(JSON.parse(window.localStorage.getItem('personalTrips')))
    } else {
      const sharedTrips = await tripService.getShared()
      await this.props.setSharedTrips(sharedTrips)

      const personalTrips = await tripService.getPersonal()
      await this.props.setPersonalTrips(personalTrips)
      if (this.props.loggedUser) {
        const user = await accountService.getAccount()
        await this.props.setLoggedUser(user)
      }

      this.loadPosition().then(async (position) => {
        try {
          const weather = await weatherService.getWeather(position)
          this.props.setWeather(weather)
        } catch (error) {
          this.props.setWeather({description: 'Not available', temperature: 'Not available', wind: 'Not available'})
        }
      })
    }

    axios.interceptors.request.use(req => {
      if (!navigator.onLine) {
        const cached = JSON.parse(window.localStorage.getItem('cached_requests'))
        cached.push(req)
        window.localStorage.setItem('cached_requests', JSON.stringify(cached))
        throw new axios.Cancel({ body: req.data, message: "Offline" })
      } else {
        return req
      }
    }, error => {
      return Promise.reject(error)
    })

  }

  loadPosition = async () => {
    try {
      const position = await this.getCurrentPosition()
      const { latitude, longitude } = position.coords
      return {
        lat: latitude,
        lng: longitude
      }
    } catch (error) {
      console.log(error)
    }
  }

  getCurrentPosition = (options = {}) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }

  reloadPage() {
    this.setState(this.state)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.reloadPage.bind(this))
  }

  scrollToTop = index => {
    Array.from(this.el.containerNode.children).forEach((child, i) => {
      if (index !== i) {
        child.scrollTo(0, 0);
      }
    });
  };

  render() {
    return (
      <div className="App">
        <HeaderWithRouter loggedUser={this.props.loggedUser} />
        <div className="Container">
          {this.props.loggedUser ?
            <SwipeableRoutes innerRef={el => (this.el = el)} onChangeIndex={this.scrollToTop} containerStyle={{ height: window.innerHeight * 0.7, maxHeight: '600px' }}>
              <Route path="/personal" component={PersonalTripsPage} />
              <Route exact path="/" component={BrowsingPage} />
              <Route path="/new" component={NewTripPage} />
              <Route exact path="/userpage" component={UserPage} />
              <Route exact path="/trip/:id" defaultParams={{ id: '0' }} render={({ match }) => (
                <ShowRoute key={match.params.id} id={match.params.id} />
              )} />
              <Route path="/account/:id/modify" defaultParams={{ id: '1' }} render={({ match }) => (
                <ModifyAccountInfo key={match.params.id} />
              )} />
            </SwipeableRoutes>

            :
            <SwipeableRoutes innerRef={el => (this.el = el)} onChangeIndex={this.scrollToTop} containerStyle={{ height: window.innerHeight * 0.7, maxHeight: '600px' }}>
              <Route path="/personal" component={PersonalTripsPage} />
              <Route exact path="/" component={BrowsingPage} />
              <Route path="/new" component={NewTripPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisteringPage} />
              <Route path="/trip/:id" defaultParams={{ id: '0' }} render={({ match }) => (
                <ShowRoute key={match.params.id} id={match.params.id} />
              )} />
            </SwipeableRoutes>
          }


          {/* <div style={{backgroundColor:'whitesmoke', color: 'black', position:'absolute', bottom:'0', left: '0', right: '0'}}>
          <h2>ffoooooooooter</h2>
          </div> */}
        </div>

        <div className='footer'>
          <Notification />
          {this.props.weather ?
            `${this.props.weather.description}, temp ${this.props.weather.temperature}°C, wind speed ${this.props.weather.wind}m/s`
            :
            'Fetching weather info...'}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedUser: state.loggedUser,
  sharedTrips: state.sharedTrips,
  personalTrips: state.personalTrips,
  weather: state.weather
})

export default connect(mapStateToProps,
  { setLoggedUser, setSharedTrips, setPersonalTrips, concatToPersonalTrips, setWeather })(App)
