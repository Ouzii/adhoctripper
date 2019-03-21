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
import NewTripPage from './components/NewTripPage';
import Notification from './components/Notification';
import UserPage from './components/UserPage';
import authService from './services/auth'
import BrowsingPage from './components/BrowsingPage';
import tripService from './services/trip';
import ShowRoute from './components/ShowRoute';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  async componentDidMount() {
    // window.addEventListener('resize', () => this.setState(this.state))
    const token = JSON.parse(window.localStorage.getItem('id_token'))
    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    if(token && !authService.isTokenExpired(token) && user) {
      this.props.setLoggedUser(user)
      authService.setToken(token)
    } else {
      window.localStorage.removeItem('id_token')
      window.localStorage.removeItem('loggedUser')
    }
    const sharedTrips = await tripService.getShared()
    this.props.setSharedTrips(sharedTrips)
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize')
  // }

  scrollToTop = index => {
    Array.from(this.el.containerNode.children).forEach((child, i) => {
      if (index !== i) {
        child.scrollTo(0, 0);
      }
    });
  };

  historyView() {
    return <div>HISTORY</div>
  }
  socialView() {
    return <div>SOCIAL</div>
  }

  render() {
    return (
      <div className="App">
        <HeaderWithRouter loggedUser={this.props.loggedUser} />
        <div className="Container">
          {this.props.loggedUser ?
            <SwipeableRoutes innerRef={el => (this.el = el)} onChangeIndex={this.scrollToTop} containerStyle={{ height: window.innerHeight * 0.7, maxHeight: '600px' }}>
              <Route path="/history" component={this.historyView} />
              <Route exact path="/" component={BrowsingPage} />
              <Route path="/new" component={NewTripPage} />
              <Route path="/userpage" component={UserPage} />
              <Route path="/trip/:id" defaultParams={{id: '0'}} render={({ match }) => (
              <ShowRoute key={match.params.id} id={match.params.id}/>
            )} />
            </SwipeableRoutes>
            
            :
            <SwipeableRoutes innerRef={el => (this.el = el)} onChangeIndex={this.scrollToTop} containerStyle={{ height: window.innerHeight * 0.7, maxHeight: '600px' }}>
              <Route path="/history" component={this.historyView} />
              <Route exact path="/" component={BrowsingPage} />
              <Route path="/new" component={NewTripPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisteringPage} />
              <Route path="/trip/:id" defaultParams={{id: '0'}} render={({ match }) => (
              <ShowRoute key={match.params.id} id={match.params.id}/>
            )} />
            </SwipeableRoutes>
          }
          
          <Notification />
        </div>
        

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedUser: state.loggedUser,
  sharedTrips: state.sharedTrips
})

export default connect(mapStateToProps,
  { setLoggedUser, setSharedTrips })(App)
