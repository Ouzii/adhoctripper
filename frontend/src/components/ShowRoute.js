/*global google*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import tripService from '../services/trip'
import { withGoogleMap, GoogleMap } from 'react-google-maps'
import Mark from './Mark'
import RouteMapping from './RouteMapping'
import TripPriceInfo from './TripPriceInfo'
import Spinner from 'react-spinkit'
import GoogleMapLink from './GoogleMapLink'
import { NavLink } from 'react-router-dom'
import weatherService from '../services/weather'

class ShowRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            trip: null,
            directions: null,
            vehicle: null,
            estFuelPrice: null,
            googleLink: 'https://www.google.com/maps/dir/',
            startWeather: null,
            endWeather: null
        }

        this.directionsService = new google.maps.DirectionsService()
        this.panelItem = React.createRef()
        this.directionsItem = React.createRef()
        this.googleLinkItem = React.createRef()
    }

    async componentDidMount() {
        try {
            if (this.state.id !== '0') {
                let trip = this.props.allTrips.filter(trip => {
                    return trip.id === this.state.id
                })[0]
                if (!trip) {
                    trip = await tripService.getOne(this.state.id)
                }
                let googleLink = this.state.googleLink + `${trip.start.lat},${trip.start.lng}/`
                trip.markers.forEach(marker => {
                    googleLink = googleLink + `${marker.lat},${marker.lng}/`
                })
                googleLink = googleLink + `${trip.end.lat},${trip.end.lng}`
                let startWeather = null
                let endWeather = null
                if (navigator.onLine) {
                    startWeather = await weatherService.getWeather(trip.start)
                    endWeather = await weatherService.getWeather(trip.end)
                }
                await this.setState({
                    trip: trip,
                    vehicle: this.props.loggedUser ? this.props.loggedUser.vehicles[0] : null,
                    estFuelPrice: this.props.loggedUser ? this.props.loggedUser.estFuelPrice : 0,
                    googleLink: googleLink,
                    startWeather: startWeather,
                    endWeather: endWeather
                })
                if (navigator.onLine) {
                    await this.getRoute()
                }
            }
        } catch (error) {
            console.log(error)
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
                this.directionsItem.current.setState({ directions: {...result}, panel: this.panelItem })
                this.googleLinkItem.current.updateLink({ origin: { location: this.state.trip.start }, destination: { location: this.state.trip.end }, result })
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

        if (!navigator.onLine) {
            const trip = this.props.allTrips.filter(trip => {
                return trip.id === this.state.id
            })[0]
            return (
                <div>
                    {trip ?
                        <div>
                            <h5>Offline view</h5>
                            <h1>{trip.name}</h1>
                            <TripPriceInfo user={this.props.loggedUser} length={trip.length} />
                            Start: {trip.startAddress}<br />
                            End: {trip.endAddress}<br />
                            Via {trip.markers.length} {trip.markers.length === 1 ? 'waypoint' : 'waypoints'}
                        </div>
                        :
                        <div />
                    }
                </div>
            )
        }

        if (this.state.id === '0') {
            return (
                <div className='noTrips'>
                    <h2>No trip info to show</h2>
                    <NavLink to='/personal' >Go to my trips</NavLink>
                </div>
            )
        }

        return (
            <div>
                <div className="showRoute">
                    <h1>{this.state.trip ? this.state.trip.name : 'Loading..'}</h1>
                    {this.state.trip && this.state.trip.length ?
                        <div>
                            <TripPriceInfo user={this.props.loggedUser} length={this.state.trip.length} />
                        </div>
                        :
                        <div />}
                    <br />
                    {this.state.trip ?
                        <div>
                            <MapWithMarker
                                containerElement={<div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.9, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />}
                                mapElement={<div style={{ height: `100%`, position: 'relative' }} />}
                                position={this.state.trip.start}
                                marker={<Mark markers={this.state.trip.markers} />}
                                routeMapper={<RouteMapping directions={this.state.directions} ref={this.directionsItem} panel={this.panelItem} />}
                            /><br />
                            <div id="directions-panel" style={{ width: window.innerWidth * 0.8 }} ref={this.panelItem} /><br />
                            <GoogleMapLink ref={this.googleLinkItem} /><br />
                            {this.state.startWeather && this.state.endWeather ?
                                <div>
                                    Current weather at origin:<br /> {this.state.startWeather.description}, temp {this.state.startWeather.temperature}°C, wind {this.state.startWeather.wind}m/s<br /><br />
                                    Current weather at destination:<br /> {this.state.endWeather.description}, temp {this.state.endWeather.temperature}°C, wind {this.state.endWeather.wind}m/s
                            </div>
                                :
                                <div />}
                        </div>
                        :
                        <Spinner style={{ margin: "auto" }} name='circle' fadeIn='none' color='white' />
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser,
    allTrips: state.personalTrips && state.sharedTrips ?
        state.personalTrips.concat(state.sharedTrips.filter(trip => {
            if (state.loggedUser) {
                return trip.user !== state.loggedUser.id
            } else {
                return true
            }
        }))
        :
        null,
    weather: state.weather
})


export default connect(mapStateToProps, null)(ShowRoute)