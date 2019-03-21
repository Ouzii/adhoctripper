import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import TripList from './TripList';

class BrowsingPage extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  

  render() {
    return (
      <div>
        {this.props.sharedTrips ? (this.props.sharedTrips.length === 0 ? <h3>No shared trips</h3> : <TripList trips={this.props.sharedTrips} />) : <Spinner style={{ margin: 'auto'}} name='circle' fadeIn='none' color='white' /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    sharedTrips: state.sharedTrips
})

export default connect(mapStateToProps, null)(BrowsingPage)
