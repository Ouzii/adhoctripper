import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import TripList from './TripList'

class BrowsingPage extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       trips: this.props.sharedTrips
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sharedTrips !== this.state.trips) {
      this.setState({ trips: nextProps.sharedTrips })
    }
  }
  
  render() {
    return (
      <div>
        <h1>Shared trips</h1>
        {this.state.trips ? (this.state.trips.length === 0 ? <h3>No shared trips</h3> : <TripList trips={this.state.trips} personal={false} />) : <Spinner style={{ margin: 'auto'}} name='circle' fadeIn='none' color='white' /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    sharedTrips: state.sharedTrips
})

export default connect(mapStateToProps, null)(BrowsingPage)
