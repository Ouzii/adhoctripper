/*global google*/
import React from 'react'
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import Mark from './Mark'
import RouteMapping from './RouteMapping';
import LocationInfo from './LocationInfo'
import GoogleMapLink from './GoogleMapLink'


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
        this.googleLinkItem = React.createRef()
        this.directionService = new google.maps.DirectionsService()
        this.markers = []
        this.directions = {routes: []}
        this.saveTrip = props.saveTrip
        this.length = 0
    }

    componentDidMount() {
        window.addEventListener('resize', this.updatePage.bind(this))
    }

    updatePage() {
        this.setState(this.state)
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updatePage.bind(this))
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
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.directions = { ...result }
                this.directionsItem.current.setState({ directions: this.directions, panel: this.panelItem })
                this.markItem.current.setState({ markers: [] })
                this.googleLinkItem.current.updateLink({origin, destination, result})
                this.length = result.routes[0].legs.map(leg => leg.distance.value).reduce((total, current) => { return total + current })
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }

    getMarkers(markers) {
        this.markers = this.markers.concat(markers)
    }

    resetAll() {
        this.markers = []
        this.directions = { routes: [] }
        this.markItem.current.setState({markers: []})
        this.directionsItem.current.setState({directions: this.directions, panel: this.panelItem})
        while(this.panelItem.current.firstChild) {
            this.panelItem.current.removeChild(this.panelItem.current.firstChild)
        }
    }

    addMarkerByAddress(marker) {
        const markers = this.markItem.current.state.markers.slice()
        markers.push(marker)
        this.markItem.current.setState({markers: markers})
        this.getMarkers(marker)
    }

    render() {
        if (!navigator.onLine) {
            return null
        }

        const MapWithMarker = withGoogleMap(props => (
            <GoogleMap
                defaultCenter={props.position}
                defaultZoom={10}
                onClick={(event) => {
                    const markers = this.markItem.current.state.markers.slice()
                    const newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() }
                    markers.push(newMarker)
                    this.markItem.current.setState({markers: markers})
                    props.giveMarkers(newMarker)
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
                <button onClick={async () => {
                    if (!currentAdded()) {
                        const markers = this.markItem.current.state.markers.slice()
                        markers.push(this.state.position)
                        await this.markItem.current.setState({markers: markers})
                        this.getMarkers(this.state.position)
                    }
                }}>Add current location</button><br/><br/>
                <p>...or click the map to add waypoints</p>
                <MapWithMarker
                    containerElement={<div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.8, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />}
                    mapElement={<div style={{ height: `100%`, position: 'relative', zIndex: '1000' }} />}
                    position={this.state.position}
                    marker={<Mark markers={this.markers} ref={this.markItem} />}
                    routeMapper={<RouteMapping directions={this.directions} ref={this.directionsItem} panel={this.panelItem}/>}
                    giveMarkers={this.getMarkers.bind(this)}
                /><br/>
                <button onClick={() => this.getRoute()}>Generate route via waypoints</button><br/><br/>
                <div id="directions-panel" style={{width: window.innerWidth * 0.8}} ref={this.panelItem}/><br/>
                <GoogleMapLink ref={this.googleLinkItem}/><br/><br/>
                <button onClick={() => this.resetAll()}>RESET ALL</button><br/><br/>
            </div>
        )
    }
}

export default Map