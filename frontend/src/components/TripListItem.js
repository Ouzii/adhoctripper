import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import tripService from '../services/trip'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { addToSharedTrips, removeFromSharedTrips } from '../reducers/sharedTripsReducer'
import { updatePersonalTrips } from '../reducers/personalTripsReducer'

class TripListItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            trip: props.trip,
            extended: false,
            personal: props.personal
        }
    }

    toggleExtended() {
        this.setState({
            extended: !this.state.extended
        })
    }

    shareTrip = async (event) => {
        try {
            const updatedTrip = await tripService.update({ ...this.state.trip, shared: !this.state.trip.shared }, this.state.trip.id)
            await this.setState({ trip: updatedTrip })
            await this.props.updatePersonalTrips(updatedTrip)
            if (updatedTrip.shared) {
                await this.props.addToSharedTrips(updatedTrip)
            } else {
                await this.props.removeFromSharedTrips(updatedTrip)
            }
            await this.props.notify(updatedTrip.shared ? `${updatedTrip.name} shared` : `${updatedTrip.name} unshared`, 3000)
        } catch (error) {
            console.log(error)
            await this.props.notify(error.response.data.error, 3000)
        }
    }

    render() {
        return (
            <div className='tripListItem'>
                {this.state.extended ?
                    <div style={{ border: '4px solid grey', borderRadius: '12px' }}>
                        <div onClick={this.toggleExtended.bind(this)}>
                            <h1>{this.state.trip.name}</h1>
                            <h4>From {this.state.trip.startAddress}</h4>
                            <h4>To {this.state.trip.endAddress}</h4>
                            <h4>via {this.state.trip.markers.length} {this.state.trip.markers.length === 1 ? 'waypoint' : 'waypoints'}</h4>
                            <p>{this.state.trip.description}</p>
                            <NavLink to={`/trip/${this.state.trip.id}`} >Show</NavLink><br /><br />
                        </div>
                        {this.state.personal ?
                            <div>
                                <button onClick={this.shareTrip.bind(this)}>{this.state.trip.shared ? 'Unshare' : 'Share'}</button>
                            </div>
                            :
                            null
                        }
                    </div>
                    :
                    <div onClick={this.toggleExtended.bind(this)} style={{ border: '4px solid grey', borderRadius: '12px' }}>
                        <h1>{this.state.trip.name}</h1>
                    </div>
                }
                <br />
            </div>
        )
    }
}


export default connect(null, { notify, addToSharedTrips, removeFromSharedTrips, updatePersonalTrips })(TripListItem)