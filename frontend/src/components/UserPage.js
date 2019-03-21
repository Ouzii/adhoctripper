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
        window.localStorage.removeItem('id_token')
        this.props.history.push('/')
        this.props.notify("Logged out", 3000)
    }

    deleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account and all your data?')) {
            await authService.remove()
            this.props.setLoggedUser(null)
            window.localStorage.removeItem('id_token')
            this.props.history.push('/')
            this.props.notify("Account deleted", 3000)
        }
    }

    handleVehicleAdd() {
        // TO BE IMPLEMENTED
    }

    render() {
        return (
            <div>
                <h2>Add a vehicle</h2>
                <form onSubmit={this.handleVehicleAdd()}>
                    <input type="text" name="vehicleName" className={'inputBar'} placeholder="Name your vehicle.." /><br />
                    <input type="number" required className={'inputBar'} name="vehicleConsumption" min="0" step="0.1" placeholder="Consumption (l/100km)" /><br /><br />
                    <input type="submit" value="Add vehicle" />
                </form><br /><br />
                <button onClick={() => this.logout()}>Logout</button><br/><br/>
                <button onClick={() => this.deleteAccount()}>Delete account</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})


export default connect(mapStateToProps, { setLoggedUser, notify })(withRouter(UserPage))
