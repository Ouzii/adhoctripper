/*global google*/
import React from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps'
class MyMapComponent extends React.Component {
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
            }
        }
    }
    render() {
        const DirectionsComponent = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDtWp9-oLmqQlWDhi8-BnocqBOzKlgt3xw",
                loadingElement: <div style={{ height: `400px` }} />,
                containerElement: <div style={{ height: `100%` }} />,
                mapElement: <div style={{ height: `400px`, width: `400px`, margin: 'auto' }} />,
                origin: this.state.origin,
                destination: this.state.destination
            }),
            withScriptjs,
            withGoogleMap,
            lifecycle({
                componentDidMount() {
                    const DirectionsService = new google.maps.DirectionsService();
                    DirectionsService.route({
                        origin: new google.maps.LatLng(this.props.origin.lat, this.props.origin.lng),
                        destination: new google.maps.LatLng(this.props.destination.lat, this.props.destination.lng),
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
            })
        )(props =>
            <GoogleMap
                defaultZoom={12}
            >
                {props.directions && <DirectionsRenderer directions={props.directions} suppressMarkers={props.markers} />}
            </GoogleMap>
        );
        return (
            <DirectionsComponent
            />
        )
    }
}
export default MyMapComponent