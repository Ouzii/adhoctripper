import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux'
import { Header } from './components/Header';
import SwipeableRoutes from 'react-swipeable-routes';
import { Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';

class App extends Component {

  loginView = () => {
    return <div>LOGIN HERE</div>
  }
  homeView() {
    return <div>HOME</div>
  }
  historyView() {
    return <div>HISTORY</div>
  }
  socialView() {
    return <div>SOCIAL</div>
  }
  render() {
    return (
      <div className="App">
        <Header />
          <SwipeableRoutes style={{height: window.innerHeight}}>
            <Route path="/history" component={this.historyView} />
            <Route exact path="/" component={this.homeView} />
            <Route path="/social" component={this.socialView} />
            <Route path="/login" component={LoginPage} />
          </SwipeableRoutes>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps,
  null)(App)
