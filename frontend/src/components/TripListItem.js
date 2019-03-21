import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class TripListItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            trip: props.trip,
            extended: false
        }
    }


    render() {
        return (
            <div>
                {this.state.extended ?
                    <div />
                    :
                    <div>
                        <p>{this.state.trip.id}</p>
                        <p>{this.state.trip.name}</p>
                        <NavLink to={`/trip/${this.state.trip.id}`} >Show</NavLink>
                    </div>
                }
            </div>
        )
    }
}
