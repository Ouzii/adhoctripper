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
            vehicleName: '',
            vehicleConsumption: ''
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

    handleVehicleAdd = async (event) => {
        event.preventDefault()
        try {
            let newUser = this.props.loggedUser
            const newVehiclesList = newUser.vehicles.map(vehicle => {return vehicle})
            newVehiclesList.push({ name: event.target.vehicleName.value, consumption: event.target.vehicleConsumption.value })
            newUser = { ...newUser, vehicles: newVehiclesList }
            const updatedUser = await authService.update(newUser, newUser.id)
            this.props.setLoggedUser(updatedUser)
            this.props.notify("Vehicle added", 3000)
            this.setState({ vehicleName: '', vehicleConsumption: '' })
        } catch (error) {
            this.props.notify(error.response.data.error, 3000)
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        return (
            <div>
                <p>You have {this.props.loggedUser.vehicles.length} vehicles</p>
                <h2>Add a vehicle</h2>
                <form onSubmit={this.handleVehicleAdd}>
                    <input type="text" name="vehicleName" className={'inputBar'} placeholder="Name your vehicle.." value={this.state.vehicleName} onChange={this.handleChange} /><br />
                    <input type="number" required className={'inputBar'} name="vehicleConsumption" min="0" step="0.1" placeholder="Consumption (l/100km)" value={this.state.vehicleConsumption} onChange={this.handleChange} /><br /><br />
                    <input type="submit" value="Add vehicle" />
                </form><br /><br />
                <button onClick={() => this.logout()}>Logout</button><br /><br />
                <button onClick={() => this.deleteAccount()}>Delete account</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})


export default connect(mapStateToProps, { setLoggedUser, notify })(withRouter(UserPage))
