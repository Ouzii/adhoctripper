/*global google*/
import React from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps'
class MapWithRoute extends React.Component {
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
        // const DirectionsComponent = compose(
        //     withProps({
        //         googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDtWp9-oLmqQlWDhi8-BnocqBOzKlgt3xw",
        //         loadingElement: <div style={{ height: `400px` }} />,
        //         containerElement: <div style={{ height: `100%` }} />,
        //         mapElement: <div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.8, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />,
        //         origin: this.state.origin,
        //         destination: this.state.destination
        //     }),
        //     withScriptjs,
        //     withGoogleMap,
        //     lifecycle({
        //         componentDidMount() {
        //             const DirectionsService = new google.maps.DirectionsService();
        //             DirectionsService.route({
        //                 origin: new google.maps.LatLng(this.props.origin.lat, this.props.origin.lng),
        //                 destination: new google.maps.LatLng(this.props.destination.lat, this.props.destination.lng),
        //                 travelMode: google.maps.TravelMode.DRIVING,
        //             }, (result, status) => {
        //                 if (status === google.maps.DirectionsStatus.OK) {
        //                     this.setState({
        //                         directions: { ...result },
        //                         markers: true
        //                     })
        //                 } else {
        //                     console.error(`error fetching directions ${result}`);
        //                 }
        //             });
        //         }
        //     })
        // )(props =>
        //     <GoogleMap
        //         defaultZoom={12}
        //         onClick={this.handleClick.bind(this)}
        //     >
        //         {props.directions && <DirectionsRenderer directions={props.directions} suppressMarkers={props.markers} />}
        //     </GoogleMap>
        // );

        const MapRoute = withGoogleMap(props =>
            <GoogleMap
                defaultZoom={12}
                onClick={props.handleClick}
            >
                {this.state.directions && <DirectionsRenderer directions={this.state.directions} suppressMarkers={this.state.markers} />}
            </GoogleMap>
        )
        return (
            <MapRoute
                googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyDtWp9-oLmqQlWDhi8-BnocqBOzKlgt3xw"}
                loadingElement={<div style={{ height: `400px` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.8, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />}
                handleClick={this.handleClick.bind(this)}
            />
            // <DirectionsComponent
            // />
        )
    }
}

export default MapWithRoute