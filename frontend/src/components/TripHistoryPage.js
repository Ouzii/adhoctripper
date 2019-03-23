import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import TripList from './TripList'

class TripHistoryPage extends Component {

  render() {
    return (
      <div>
        {this.props.personalTrips ? (this.props.personalTrips.length === 0 ? <h3>No personal trips</h3> : <TripList trips={this.props.personalTrips} personal={true} />) : <Spinner style={{ margin: 'auto'}} name='circle' fadeIn='none' color='white' /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  personalTrips: state.personalTrips
})


export default connect(mapStateToProps, null)(TripHistoryPage)
