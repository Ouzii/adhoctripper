import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Map from './Map'
import MyMapComponent from './MyMapComponent'
class NewTripPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            origin: null,
            destination: null,
            pos: null,
            markers: []
        }

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

    handleClick(event) {
        // origin: pos, destination: { lat: 60.235083, lng: 25.035553 },

        if (!this.state.origin) {
            this.setState({
                origin: { lat: event.latLng.lat(), lng: event.latLng.lng() },
                markers: this.state.markers.push({ lat: event.latLng.lat(), lng: event.latLng.lng() })
            })
        } else if (!this.state.destination) {
            this.setState({
                destination: { lat: event.latLng.lat(), lng: event.latLng.lng() }
            })
        }
    }


    render() {
        return (
            <div>
                <h2>Start: {this.state.origin ? `${this.state.origin.lat}, ${this.state.origin.lng}`: ''}</h2>
                <h2>End: {this.state.destination ? `${this.state.destination.lat}, ${this.state.destination.lng}`: ''}</h2>
                {this.state.origin && this.state.destination ?
                    <MyMapComponent origin={this.state.origin} destination={this.state.destination} />
                    :
                    this.state.pos ?
                        <div>
                        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDtWp9-oLmqQlWDhi8-BnocqBOzKlgt3xw"></script>
                        <Map pos={this.state.pos} markers={this.state.markers} onClick={this.handleClick.bind(this)}/>
                        </div>
                        : <div></div>
                        }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, null)(withRouter(NewTripPage))
