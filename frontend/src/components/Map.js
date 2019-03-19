/*global google*/
import React from 'react'
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import Mark from './Mark'
import RouteMapping from './RouteMapping';
import LocationInfo from './LocationInfo'


class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: {
                lat: parseFloat(this.props.pos.lat),
                lng: parseFloat(this.props.pos.lng)
            }
        }
        this.markItem = React.createRef()
        this.directionsItem = React.createRef()
        this.panelItem = React.createRef()
        this.directionService = new google.maps.DirectionsService()
        this.markers = []
        this.directions = {routes: []}
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState(this.state))
    }

    componentWillUnmount() {
        window.removeEventListener('resize')
    }

    getRoute() {
        if (this.markers.length === 0) {
            return
        }
        const waypts = this.markers.map(wp => {
            return {
                location: { lat: wp.lat, lng: wp.lng },
                stopover: true
            }
        })
        const origin = waypts[0]
        const destination = waypts[waypts.length - 1]
        const middlePoints = waypts.slice(1, this.markers.length - 1)
        this.directionService.route({
            origin: new google.maps.LatLng(origin.location.lat, origin.location.lng),
            destination: new google.maps.LatLng(destination.location.lat, destination.location.lng),
            waypoints: middlePoints,
            travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.directions = { ...result }
                this.directionsItem.current.setState({ directions: this.directions })
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }

    getMarkers(markers) {
        this.markers = markers
    }

    resetAll() {
        this.markers = []
        this.directions = { routes: [] }
        this.markItem.current.setState({markers: []})
        this.directionsItem.current.setState({directions: {routes:[]}})
    }

    addMarkerByAddress(marker) {
        const markers = this.markItem.current.state.markers
        markers.push(marker)
        this.markItem.current.setState(markers)
        this.getMarkers(markers)
    }

    render() {
        const MapWithMarker = withGoogleMap(props => (
            <GoogleMap
                defaultCenter={props.position}
                defaultZoom={10}
                onClick={(event) => {
                    const markers = this.markItem.current.state.markers
                    markers.push({ lat: event.latLng.lat(), lng: event.latLng.lng() })
                    this.markItem.current.setState(markers)
                    props.giveMarkers(markers)
                }}
            >
                {this.directions && props.routeMapper}
                {props.marker}

            </GoogleMap>
        ));

        const currentAdded = () => {
            const markers = this.markers.filter(marker => {
                return (marker.lat !== this.state.position.lat && marker.lng !== this.state.position.lng)
            })
            return markers.length !== this.markers.length
        }
        return (
            <div>
                <LocationInfo addMarker={this.addMarkerByAddress.bind(this)} /><br/>
                <button onClick={() => {
                    if (!currentAdded()) {
                        const markers = this.markItem.current.state.markers
                        markers.push(this.state.position)
                        this.markItem.current.setState(markers)
                        this.getMarkers(markers)
                    }
                }}>Add current location</button>
                <MapWithMarker
                    containerElement={<div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.8, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />}
                    mapElement={<div style={{ height: `100%`, position: 'relative', zIndex: '1000' }} />}
                    position={this.state.position}
                    marker={<Mark markers={this.markers} ref={this.markItem} />}
                    routeMapper={<RouteMapping directions={this.directions} ref={this.directionsItem} panel={this.panelItem}/>}
                    giveMarkers={this.getMarkers.bind(this)}
                /><br/>
                <button onClick={() => this.getRoute()}>Generate route via waypoints</button><br/>
                <div id="directions-panel" style={{width: window.innerWidth * 0.8}} ref={this.panelItem}></div><br/>
                <button onClick={() => this.resetAll()}>RESET ALL</button>
            </div>
        )
    }
}

export default Map