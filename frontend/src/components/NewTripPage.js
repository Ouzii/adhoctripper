import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Map from './Map'
import tripService from '../services/trip'
import { notify } from '../reducers/notificationReducer'
import TripInfo from './TripInfo'

class NewTripPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pos: null
        }

        this.mapItem = React.createRef()
        this.tripInfoItem = React.createRef()
        this.geocoder = new window.google.maps.Geocoder()
    }

    componentWillMount() {
        this.loadPosition().then(pos => {
            this.setState({ pos: pos })
        })
    }

    loadPosition = async () => {
        try {
            const position = await this.getCurrentPosition()
            const { latitude, longitude } = position.coords
            return {
                lat: latitude,
                lng: longitude
            }
        } catch (error) {
            console.log(error)
        }
    }

    getCurrentPosition = (options = {}) => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options)
        })
    }

    getAddress(start) {
        return new Promise((resolve, reject) => this.geocoder.geocode({location: start}, (results, status) => {
            if (status === 'OK') {
                resolve(results[0].formatted_address)
            }
        })
        )
    }

    saveTrip = async () => {
        const start = this.mapItem.current.markers[0]
        const end = this.mapItem.current.markers[this.mapItem.current.markers.length - 1]
        const startAddress = await this.getAddress(start)
        const endAddress = await this.getAddress(end)

            const newTrip = {
                name: this.tripInfoItem.current.state.name,
                description: this.tripInfoItem.current.state.description,
                start: JSON.stringify(start),
                end: JSON.stringify(end),
                startAddress: startAddress,
                endAddress: endAddress,
                markers: JSON.stringify(this.mapItem.current.markers.slice(1, this.mapItem.current.markers.length - 1)),
                // directions: JSON.stringify(this.mapItem.current.directions),
                user: this.props.loggedUser ? this.props.loggedUser.id : null
            }

            try {
                await tripService.saveOne(newTrip)
                this.mapItem.current.resetAll()
                this.tripInfoItem.current.setState({ name: '', description: ''})
                this.props.notify("Trip saved", 3000)
            } catch (error) {
                this.props.notify(error.response.data.error, 3000)
            }
    }

    render() {
        return (
            <div>
                {this.state.pos ?
                    <div>
                        <TripInfo ref={this.tripInfoItem}/>
                        <Map pos={this.state.pos} saveTrip={this.saveTrip.bind(this)} loggedUser={this.props.loggedUser} ref={this.mapItem} />
                        {this.props.loggedUser ? <button onClick={() => this.saveTrip()}>Save Trip</button> : null}
                    </div>
                    : <h3>Enable location to plan a trip</h3>
                }
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})


export default connect(mapStateToProps, { notify })(withRouter(NewTripPage))
