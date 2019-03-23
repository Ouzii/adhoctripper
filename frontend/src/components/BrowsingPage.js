import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import TripList from './TripList'

class BrowsingPage extends Component {

  render() {
    return (
      <div>
        <h1>Shared trips</h1>
        {this.props.sharedTrips ? (this.props.sharedTrips.length === 0 ? <h3>No shared trips</h3> : <TripList trips={this.props.sharedTrips} personal={false} />) : <Spinner style={{ margin: 'auto'}} name='circle' fadeIn='none' color='white' /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    sharedTrips: state.sharedTrips
})

export default connect(mapStateToProps, null)(BrowsingPage)
