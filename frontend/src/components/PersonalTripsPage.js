import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import TripList from './TripList'

class PersonalTripsPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            trips: this.props.personalTrips,
            filter: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.personalTrips !== this.state.trips) {
            this.setState({
                trips: nextProps.personalTrips
            })
        }
    }



    render() {
        return (
            <div>
                <h1>My trips</h1>
                {this.state.trips ? (this.state.trips.length === 0 ? <h3>No personal trips</h3> : <TripList trips={this.state.trips} personal={true} />) : <Spinner style={{ margin: 'auto' }} name='circle' fadeIn='none' color='white' />}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    personalTrips: state.personalTrips
})


export default connect(mapStateToProps, null)(PersonalTripsPage)
