import React, { Component } from 'react'
import TripListItem from './TripListItem';

class TripList extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         trips: props.trips,
         personal: props.personal
      }
    }
    
  render() {
    return (
      <div>
        {this.state.trips.map(trip => <TripListItem trip={trip} personal={this.state.personal} key={trip.id}/>)}
      </div>
    )
  }
}


export default TripList
