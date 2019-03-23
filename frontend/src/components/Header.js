import React, { Component } from 'react'
import logo from '../logo.png'
import { NavLink, withRouter } from 'react-router-dom'

class Header extends Component {

    render() {
        return (
            <div className="App-header" >
                <div className="navbar">
                    <img src={logo} className="App-logo left" alt="logo" />
                    {this.props.loggedUser ?
                     <NavLink to="/userpage" className="right">Userpage</NavLink>
                     :
                     <NavLink to="/login" className="right">Login/Register</NavLink>}
                    <ul className="navbar-buttons">
                        <li><NavLink to="/personal">My trips</NavLink></li>
                        <li><NavLink exact to="/">Browse</NavLink></li>
                        <li><NavLink to="/new">New trip</NavLink></li>
                    </ul>
                </div>
            </div>
        )
    }
}
const HeaderWithRouter = withRouter(Header)
export default HeaderWithRouter