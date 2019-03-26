import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setLoggedUser } from '../reducers/authReducer'
import { setPersonalTrips } from '../reducers/personalTripsReducer'
import { notify } from '../reducers/notificationReducer'
import { withRouter, NavLink } from 'react-router-dom'
import authService from '../services/auth'
import accountService from '../services/account'
import VehicleModifyingItem from './VehicleModifyingItem';

class UserPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modifyVehicles: false,
            vehicles: this.props.loggedUser.vehicles,
            estFuelPrice: this.props.loggedUser.estFuelPrice ? this.props.loggedUser.estFuelPrice : 0,
            vehicleName: '',
            vehicleConsumption: ''
        }
    }

    logout() {
        this.props.setLoggedUser(null)
        this.props.setPersonalTrips([])
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
            const newVehiclesList = newUser.vehicles.map(vehicle => { return vehicle })
            newVehiclesList.push({ name: event.target.vehicleName.value, consumption: event.target.vehicleConsumption.value })
            newUser = { ...newUser, vehicles: newVehiclesList }
            const updatedUser = await accountService.updateVehicles(newUser, newUser.id)
            this.props.setLoggedUser(updatedUser)
            this.props.notify("Vehicle added", 3000)
            this.setState({ vehicleName: '', vehicleConsumption: '', vehicles: updatedUser.vehicles })
        } catch (error) {
            this.props.notify(error.response.data.error, 3000)
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleModifySave = async (vehicle) => {
        try {
            const newVehiclesList = this.props.loggedUser.vehicles.slice()
            newVehiclesList[vehicle.id] = { name: vehicle.name, consumption: vehicle.consumption }
            const newUser = { ...this.props.loggedUser, vehicles: newVehiclesList }
            const updatedUser = await accountService.updateVehicles(newUser, newUser.id)

            this.props.setLoggedUser(updatedUser)
            this.setState({
                vehicles: newVehiclesList
            })
            this.props.notify("Saved", 3000)
        } catch (error) {
            console.log(error)
            this.props.notify(error.response.data.error, 3000)
        }

    }

    deleteVehicle = async (vehicle) => {
        try {
            if (window.confirm(`You sure you want to delete ${vehicle.name}?`)) {
                const newVehiclesList = this.props.loggedUser.vehicles.slice()
                newVehiclesList.splice(vehicle.id, 1)
                const newUser = { ...this.props.loggedUser, vehicles: newVehiclesList }
                const updatedUser = await accountService.updateVehicles(newUser, newUser.id)

                this.props.setLoggedUser(updatedUser)
                this.setState({
                    vehicles: newVehiclesList
                })
                this.props.notify(`${vehicle.name} deleted`, 3000)
            }
        } catch (error) {
            console.log(error)
            this.props.notify(error.response.data.error, 3000)
        }
    }

    changeFuelPrice = async (event) => {
        event.preventDefault()
        try {
            let newUser = this.props.loggedUser
            newUser.estFuelPrice = this.state.estFuelPrice
            const updatedUser = await accountService.updateEstFuelPrice(newUser, newUser.id)
            this.props.setLoggedUser(updatedUser)
            this.props.notify("Saved", 3000)
        } catch (error) {
            console.log(error)
            this.props.notify(error.response.data.error, 3000)
        }
    }

    render() {
        return (
            <div className='userpage'>
                <h4>Logged in as {this.props.loggedUser.username}</h4>
                <form onSubmit={this.changeFuelPrice} style={{ border: 'solid grey', borderWidth: '4px 4px 0px 4px' }}>
                    <br />
                    <label>Estimated fuel price (eur/l)</label><br />
                    <input type="number" name="estFuelPrice" value={this.state.estFuelPrice} onChange={this.handleChange} placeholder="Estimated fuel price.." /><br /><br />
                    <input type="submit" value="Save" /><br /><br />
                </form>
                <div style={{ border: '4px solid grey' }}>

                    <p>You have {this.props.loggedUser.vehicles.length} vehicles</p>
                    {this.state.modifyVehicles ?
                        <div>
                            {this.state.vehicles.map(vehicle => <VehicleModifyingItem id={this.state.vehicles.indexOf(vehicle)} vehicle={vehicle} saveVehicleModify={this.handleModifySave.bind(this)} deleteVehicle={this.deleteVehicle.bind(this)} key={`${vehicle.name}+${vehicle.consumption}+${Math.random(100)}`} />)}
                        </div>
                        :
                        <div>
                            <h2>Add a vehicle</h2>
                            <form onSubmit={this.handleVehicleAdd}>
                                <input type="text" required name="vehicleName" className={'inputBar'} placeholder="Name your vehicle.." value={this.state.vehicleName} onChange={this.handleChange} /><br />
                                <input type="number" required className={'inputBar'} name="vehicleConsumption" min="0" step="0.1" placeholder="Consumption (l/100km)" value={this.state.vehicleConsumption} onChange={this.handleChange} /><br /><br />
                                <input type="submit" value="Add vehicle" />
                            </form><br />
                        </div>
                    }
                    <button onClick={() => this.setState({ modifyVehicles: !this.state.modifyVehicles })}>{this.state.modifyVehicles ? 'Close' : 'Modify vehicles'}</button><br /><br />
                </div>
                <div style={{ border: 'solid grey', borderWidth: '0px 4px 4px 4px' }}>
                    <br />
                    <button onClick={() => this.logout()}>Logout</button><br /><br />
                    <NavLink to={`/userpage/${this.props.loggedUser.id}/modify`} >Modify account information</NavLink><br /><br />
                    <button onClick={() => this.deleteAccount()}>Delete account</button><br />
                    <br />
                </div>
                <br />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})


export default connect(mapStateToProps, { setLoggedUser, notify, setPersonalTrips })(withRouter(UserPage))
