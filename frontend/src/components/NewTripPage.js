import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Map from './Map'
import tripService from '../services/trip'
import { notify } from '../reducers/notificationReducer'
import TripInfo from './TripInfo'
import { setPersonalTrips } from '../reducers/personalTripsReducer'
import mapService from '../services/map'

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

    async getAddress(location) {
        const address = await mapService.reverseGeocode(location)
        if (address.status === 'OK') {
            console.log(address)
            return address.results[0].formatted_address
        }
        // return new Promise((resolve, reject) => this.geocoder.geocode({ location: location }, (results, status) => {
        //     if (status === 'OK') {
        //         resolve(results[0].formatted_address)
        //     }
        // })
        // )
    }

    saveTrip = async () => {
        if (this.tripInfoItem.current.state.name === '') {
            this.props.notify("Trip needs a name!", 3000)
            return
        }
        const start = this.mapItem.current.markers[0]
        const end = this.mapItem.current.markers[this.mapItem.current.markers.length - 1]
        if (!start || !end) {
            this.props.notify("Trips needs some waypoints..", 3000)
            return
        }
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
            user: this.props.loggedUser ? this.props.loggedUser.id : null,
            length: this.mapItem.current.length
        }

        try {
            const savedTrip = await tripService.saveOne(newTrip)
            this.mapItem.current.resetAll()
            this.tripInfoItem.current.setState({ name: '', description: '' })
            this.props.history.push('/personal')
            const personalTrips = this.props.personalTrips.slice()
            personalTrips.push(savedTrip)
            this.props.setPersonalTrips(personalTrips)
            this.props.notify("Trip saved", 3000)

        } catch (error) {
            console.log(error)
            if (error.response) {
                this.props.notify(error.response.data.error, 3000)
            } else if (error.message.message === "Offline") {
                this.mapItem.current.resetAll()
                this.tripInfoItem.current.setState({ name: '', description: '' })
                this.props.history.push('/personal')
                const personalTrips = this.props.personalTrips.slice()
                personalTrips.push({ ...error.message.body, id: Math.random(1000) })
                this.props.setPersonalTrips(personalTrips)
                this.props.notify("Trip saved", 3000)
            }
        }
    }

    cacheOfflineTrip = (event) => {
        event.preventDefault()
        const currentOfflineTrips = JSON.parse(window.localStorage.getItem('savedOfflineTrips')) ? JSON.parse(window.localStorage.getItem('savedOfflineTrips')) : []
        const offlineTrip = {
            name: event.target.name.value,
            description: event.target.description.value,
            startAddress: event.target.start.value,
            endAddress: event.target.end.value,
            user: this.props.loggedUser.id,
            id: Math.random(1000),
            markers: [],
            length: 0,
            offlineSaved: true,
            saved: Date.now()
        }
        currentOfflineTrips.push(offlineTrip)
        window.localStorage.setItem('savedOfflineTrips', JSON.stringify(currentOfflineTrips))
        event.target.name.value = ''
        event.target.description.value = ''
        event.target.start.value = ''
        event.target.end.value = ''
        this.props.notify("Offline trip saved and will be sent to database when online!", 3000)
        const personalTrips = this.props.personalTrips.slice()
        personalTrips.push(offlineTrip)
        this.props.setPersonalTrips(personalTrips)
    }

    render() {
        if (!navigator.onLine) {
            return (
                <div>
                    <h5>Offline view</h5>
                    <h1>New trip</h1>
                    <form onSubmit={this.cacheOfflineTrip}>
                        <input name='name' className='inputBar' placeholder='Name' />
                        <input name='description' className='inputBar' placeholder='Description' />
                        <input name='start' className='inputBar' placeholder='Starting address' />
                        <input name='end' className='inputBar' placeholder='Destination address' />
                        <input type='submit' value='Save' />
                    </form>
                </div>
            )
        }

        return (
            <div>
                <h1>New trip</h1>
                {this.state.pos ?
                    <div>
                        <TripInfo ref={this.tripInfoItem} />
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
    loggedUser: state.loggedUser,
    personalTrips: state.personalTrips
})


export default connect(mapStateToProps, { notify, setPersonalTrips })(withRouter(NewTripPage))
