import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import tripService from '../services/trip'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { addToSharedTrips, removeFromSharedTrips } from '../reducers/sharedTripsReducer'
import { updatePersonalTrips, removeFromPersonalTrips } from '../reducers/personalTripsReducer'

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
            if (updatedTrip.shared) {
                await this.props.addToSharedTrips(updatedTrip)
            } else {
                await this.props.removeFromSharedTrips(updatedTrip)
            }
            await this.props.updatePersonalTrips(updatedTrip)
            
            this.props.notify(updatedTrip.shared ? `${updatedTrip.name} shared` : `${updatedTrip.name} unshared`, 3000)
        } catch (error) {
            console.log(error)
            this.props.notify(error.response.data.error, 3000)
        }
    }

    deleteTrip = async (event) => {
        try {
            if (window.confirm(`Are you sure you want to delete ${this.state.trip.name}?`)) {
                const deletedTrip = await tripService.remove(this.state.trip.id)
                if (deletedTrip.shared) {
                    this.props.removeFromSharedTrips(deletedTrip)
                }
                this.props.removeFromPersonalTrips(deletedTrip)
                this.props.notify(`${deletedTrip.name} removed`, 3000)
            }
        } catch (error) {
            console.log(error)
            this.props.notify(error.response.data.error, 3000)
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
                            <NavLink to={`/trip/${this.state.trip.id}`} >Show</NavLink><br />
                            <p>Saved {new Intl.DateTimeFormat('en-GB', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'

                                    }).format(new Date(this.state.trip.saved))}</p>
                        </div>
                        {this.state.personal ?
                            <div>
                                <button onClick={this.shareTrip.bind(this)}>{this.state.trip.shared ? 'Unshare' : 'Share'}</button>
                                <button onClick={this.deleteTrip.bind(this)}>Delete</button>
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


export default connect(null, { notify, addToSharedTrips, removeFromSharedTrips, updatePersonalTrips, removeFromPersonalTrips })(TripListItem)