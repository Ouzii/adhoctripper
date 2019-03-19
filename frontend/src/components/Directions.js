/*global google*/
import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps'
class Directions extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            origin: {
                lat: props.origin.lat,
                lng: props.origin.lng
            },
            destination: {
                lat: props.destination.lat,
                lng: props.destination.lng
            },
            clickTurn: true,
            directions: {},
            markers: false
        }
        this.directions = new google.maps.DirectionsService()
    }

    componentDidMount() {
        this.directions.route({
            origin: new google.maps.LatLng(this.state.origin.lat, this.state.origin.lng),
            destination: new google.maps.LatLng(this.state.destination.lat, this.state.destination.lng),
            travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                    directions: { ...result },
                    markers: true
                })
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }

    handleClick(event) {
        console.log(this.state.directions)
        if (this.state.clickTurn) {
            // this.setState({ origin: { lat: event.latLng.lat(), lng: event.latLng.lng() }, clickTurn: !this.state.clickTurn })
            // new google.maps.DirectionsService().route({
            //     origin: new google.maps.latLng(event.latLng.lat(), event.latLng.lng()),
            //     destination: new google.maps.LatLng(this.state.destination.lat, this.state.destination.lng),
            //     travelMode: google.maps.travelMode.DRIVING
            // }, (result, status) => {
            //     if (status === 'OK') {
            //         this.s
            //     }
            // })
            const ori = {lat: event.latLng.lat(), lng: event.latLng.lng()}
            const dest = this.state.destination
            this.directions.route({
                origin: ori,
                destination: dest,
                travelMode: 'DRIVING'
            }, (result, status) => {
                if (status === 'OK') {
                    this.setState({
                        directions: { ...result },
                        markers: true
                    })
                }
            })
            console.log(this.directions)

            // })
        } else {
            this.setState({ destination: { lat: event.latLng.lat(), lng: event.latLng.lng() }, clickTurn: !this.state.clickTurn })
        }
    }

    render() {
        return (
            <DirectionsRenderer directions={this.state.directions} suppressMarkers={this.state.markers} />
        )
    }
}

export default Directions