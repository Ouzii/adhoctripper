import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from '../logo.png'
import { NavLink } from 'react-router-dom'
export class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedUser: null
        }
    }

    render() {
        return (
            <div className="App-header" >
                
                <div className="navbar">
                <img src={logo} className="App-logo left" alt="logo" />
                {this.state.loggedUser ? <button className="right">Logout {this.state.loggedUser.username}</button> : <button className="right">Login</button>}
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

const mapStateToProps = (state) => {
    return {
        loggedUser: state.loggedUser
    }
}

export default connect(mapStateToProps,
    null)(Header)
