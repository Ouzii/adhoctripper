import React, { Component } from 'react'

export default class VehicleModifyingItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: props.id,
            name: props.vehicle.name,
            consumption: props.vehicle.consumption
        }
        this.saveVehicle = props.saveVehicleModify
        this.deleteVehicle = props.deleteVehicle
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        return (
            <div style={{ margin: 'auto' }}>
                <label>Name</label><br/>
                <input className='inputBar' name='name' value={this.state.name} type='text' onChange={this.handleChange} /><br/>
                <label>Consumption (l/100km)</label><br/>
                <input className='inputBar' name='consumption' value={this.state.consumption} type='number' min="0" step="0.1" onChange={this.handleChange} /><br />
                <button onClick={() => this.saveVehicle(this.state)}>Save</button><br /><br />
                <button onClick={() => this.deleteVehicle(this.state)}>Delete</button><br /><br />
            </div>
        )
    }
}
