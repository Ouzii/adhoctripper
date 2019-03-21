import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux'
import HeaderWithRouter from './components/Header';
import SwipeableRoutes from 'react-swipeable-routes';
import { Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisteringPage from './components/RegisteringPage';
import { setLoggedUser } from './reducers/authReducer';
import NewTripPage from './components/NewTripPage';
import Notification from './components/Notification';
import UserPage from './components/UserPage';
import authService from './services/auth'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.setState(this.state))
    const token = window.localStorage.getItem('id_token')
    const user = window.localStorage.getItem('loggedUser')
    if(token && !authService.isTokenExpired(token) && user) {
      this.props.setLoggedUser(user)
      authService.setToken(token)
    } else {
      window.localStorage.removeItem('id_token')
      window.localStorage.removeItem('loggedUser')
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize')
  }

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
              <Route exact path="/" component={NewTripPage} />
              <Route path="/social" component={this.socialView} />
              <Route path="/userpage" component={UserPage} />
            </SwipeableRoutes>
            :
            <SwipeableRoutes innerRef={el => (this.el = el)} onChangeIndex={this.scrollToTop} containerStyle={{ height: window.innerHeight * 0.7, maxHeight: '600px' }}>
              <Route path="/history" component={this.historyView} />
              <Route exact path="/" component={NewTripPage} />
              <Route path="/social" component={this.socialView} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisteringPage} />
            </SwipeableRoutes>
          }
          <Notification />
        </div>
        

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedUser: state.loggedUser
})

export default connect(mapStateToProps,
  { setLoggedUser })(App)
