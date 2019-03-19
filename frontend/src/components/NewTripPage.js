import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Map from './Map'
// import MapWithRoute from './MapWithRoute'
// import LocationInfo from './LocationInfo';
// import MapTry from '../Map/MapTry';

class NewTripPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            origin: null,
            destination: null,
            pos: null
        }
        // this.markers = []
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

    // handleClick(event) {
    //     if (!this.state.origin) {
    //         const markers = this.state.markers
    //         markers.push({ lat: event.latLng.lat(), lng: event.latLng.lng() })
    //         this.setState({
    //             origin: { lat: event.latLng.lat(), lng: event.latLng.lng() },
    //             markers: markers
    //         })
    //     } else if (!this.state.destination) {
    //         this.setState({
    //             destination: { lat: event.latLng.lat(), lng: event.latLng.lng() }
    //         })
    //     } else {
    //         if(this.state.clickTurn) {
    //             this.setState({ origin: null, markers: [], clickTurn: !this.state.clickTurn})
    //             this.handleClick(event)
    //         } else {
    //             this.setState({ destination: null, clickTurn: !this.state.clickTurn})
    //             this.handleClick(event)
    //         }
    //     }
    // }

    // getMarkers(markers) {
    //     this.markers = markers
    // }

    setLocations(results) {
        switch (results.type) {
            case 'origin':
                const markers = this.state.markers
                markers.push({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
                this.setState({
                    origin: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() },
                    markers: markers
                })
                break
            case 'destination':
                this.setState({
                    destination: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
                })
                break
            default:
                break
        }

    }

    render() {
        return (
            <div>
                {/* <LocationInfo setLocations={() => this.setLocations.bind(this)} /> */}
                {this.state.pos ?
                    <div>
                        <Map pos={this.state.pos} />
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
