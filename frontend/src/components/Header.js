import React, { Component } from 'react'
import logo from '../logo.png'
import { NavLink, withRouter } from 'react-router-dom'

class Header extends Component {

    handleLogout() {
        this.props.logout()
        this.props.history.push('/')
    }
    render() {
        return (
            <div className="App-header" >
                <div className="navbar">
                    <img src={logo} className="App-logo left" alt="logo" />
                    {this.props.loggedUser ?
                     <button onClick={() => this.handleLogout()} className="right">Logout {this.props.loggedUser.username}</button>
                     :
                     <NavLink to="/login" className="right">Login/Register</NavLink>}
                    <ul className="navbar-buttons">
                        <li><NavLink to="/history">My routes</NavLink></li>
                        <li><NavLink exact to="/">New trip</NavLink></li>
                        <li><NavLink to="/social">Other routes</NavLink></li>
                    </ul>
                </div>
            </div>
        )
    }
}
const HeaderWithRouter = withRouter(Header)
export default HeaderWithRouter