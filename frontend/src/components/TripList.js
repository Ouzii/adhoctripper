import React, { Component } from 'react'
import TripListItem from './TripListItem'
import { connect } from 'react-redux'

class TripList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trips: props.trips,
      personal: props.personal
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.personalTrips !== this.state.trips) {
      if (nextProps.personal) {
        this.setState({
          trips: nextProps.personalTrips
        })
      } else {
        this.setState({
          trips: nextProps.sharedTrips
        })
      }
      
    }
  }

  render() {
    return (
      <div>
        {this.state.trips.map(trip => <TripListItem trip={trip} personal={this.state.personal} key={trip.id} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  personalTrips: state.personalTrips,
  sharedTrips: state.sharedTrips
})


export default connect(mapStateToProps, null)(TripList)
