import React, { Component } from 'react'
import TripListItem from './TripListItem'
import { connect } from 'react-redux'

class TripList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trips: props.trips,
      personal: props.personal,
      filter: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.personal && nextProps.personalTrips !== this.state.trips) {
      this.setState({
        trips: nextProps.personalTrips
      })
    }

    if (!this.state.personal && nextProps.sharedTrips !== this.state.trips) {
      this.setState({
        trips: nextProps.sharedTrips
      })
    }

  }

  handleChange = async (event) => {
    await this.setState({
      [event.target.name]: event.target.value.toLowerCase()
    })
  }


  render() {
    const tripsToShow = () => {
      if (this.state.personal) {
        return this.props.personalTrips.filter(trip => {
          return (trip.name.toLowerCase().includes(this.state.filter) ||
            trip.description.toLowerCase().includes(this.state.filter) ||
            trip.startAddress.toLowerCase().includes(this.state.filter) ||
            trip.endAddress.toLowerCase().includes(this.state.filter)
          )
        })
      } else {
        return this.props.sharedTrips.filter(trip => {
          return (trip.name.toLowerCase().includes(this.state.filter) ||
            trip.description.toLowerCase().includes(this.state.filter) ||
            trip.startAddress.toLowerCase().includes(this.state.filter) ||
            trip.endAddress.toLowerCase().includes(this.state.filter)
          )
        })
      }
    }
    return (
      <div>
        <input type='search' className='inputBar' value={this.state.filter} onChange={this.handleChange} name='filter' placeholder='Filter trips..' /><br /><br />
        {this.state.trips ?
          <div>
            {tripsToShow().map(trip => <TripListItem trip={trip} personal={this.state.personal} key={trip.id} />)}
          </div>
          :
          <div />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  personalTrips: state.personalTrips,
  sharedTrips: state.sharedTrips
})


export default connect(mapStateToProps, null)(TripList)
