/*global google*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import tripService from '../services/trip'
import { withGoogleMap, GoogleMap } from 'react-google-maps'
import Mark from './Mark'
import RouteMapping from './RouteMapping'

class ShowRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            trip: null
        }

        this.directionsService = new google.maps.DirectionsService()
        this.panelItem = React.createRef()
        this.directionsItem = React.createRef()
    }

    async componentDidMount() {
        try {
            const trip = await tripService.getOne(this.state.id)
            await this.setState({
                trip
            })
            this.getRoute()
        } catch (error) {

        }

    }

    async getRoute() {
        const waypts = this.state.trip.markers.map(wp => {
            return {
                location: { lat: wp.lat, lng: wp.lng },
                stopover: true
            }
        })
        this.directionsService.route({
            origin: new google.maps.LatLng(this.state.trip.start.lat, this.state.trip.start.lng),
            destination: new google.maps.LatLng(this.state.trip.end.lat, this.state.trip.end.lng),
            waypoints: waypts,
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                    directions: result
                })
                this.directionsItem.current.setState({ directions: result, panel: this.panelItem})
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }


    render() {
        const MapWithMarker = withGoogleMap(props => (
            <GoogleMap
                defaultCenter={props.position}
                defaultZoom={10}
            >
                {this.state.directions && props.routeMapper}
                {props.marker}
            </GoogleMap>
        ));
        return (
            <div>
                {this.state.trip ?
                    this.state.directions ?
                        <div>
                            <MapWithMarker
                                containerElement={<div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.9, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />}
                                mapElement={<div style={{ height: `100%`, position: 'relative', zIndex: '1000' }} />}
                                position={this.state.trip.start}
                                marker={<Mark markers={this.state.trip.markers} />}
                                routeMapper={<RouteMapping directions={this.state.directions} ref={this.directionsItem} panel={this.panelItem} />}
                            /><br/>
                            <div id="directions-panel" style={{ width: window.innerWidth * 0.8 }} ref={this.panelItem} />
                        </div>
                        :
                        <div />
                    :
                    <div />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, null)(ShowRoute)