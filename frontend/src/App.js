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

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidUpdate() {
  }


  historyView() {
    return <div>HISTORY</div>
  }
  socialView() {
    return <div>SOCIAL</div>
  }
  logout() {
    this.props.setLoggedUser(null)
  }
  render() {
    return (
      <div className="App">
        <HeaderWithRouter loggedUser={this.props.loggedUser} logout={() => this.logout()} />
        {this.props.loggedUser ?
          <SwipeableRoutes style={{ height: window.innerHeight }}>
            <Route path="/history" component={this.historyView} />
            <Route exact path="/" component={NewTripPage} />
            <Route path="/social" component={this.socialView} />
          </SwipeableRoutes>
          :
          <SwipeableRoutes style={{ height: window.innerHeight }}>
            <Route path="/history" component={this.historyView} />
            <Route exact path="/" component={NewTripPage} />
            <Route path="/social" component={this.socialView} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisteringPage} />
          </SwipeableRoutes>
        }


      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedUser: state.loggedUser
})

export default connect(mapStateToProps,
  { setLoggedUser })(App)
