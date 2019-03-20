import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setLoggedUser } from '../reducers/authReducer'
import { notify } from '../reducers/notificationReducer'
import { withRouter } from 'react-router-dom'
import authService from '../services/auth'

class UserPage extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    logout() {
        this.props.setLoggedUser(null)
        this.props.history.push('/')
        this.props.notify("Logged out", 3000)
    }

    handleSubmit() {
        // TO BE IMPLEMENTED
    }

    render() {
        return (
            <div>
                <h2>Add a vehicle</h2>
                <form onSubmit={this.handleSubmit()}>
                    <input type="text" name="vehicleName" className={'inputBar'} placeholder="Name your vehicle.."/><br/>
                    <input type="number" required className={'inputBar'} name="vehicleConsumption" min="0" step="0.1" placeholder="Consumption (l/100km)" /><br/><br/>
                    <input type="submit" value="Add vehicle"/>
                </form><br/><br/>
                <button onClick={() => this.logout()}>Logout</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})


export default connect(mapStateToProps, { setLoggedUser, notify })(withRouter(UserPage))
