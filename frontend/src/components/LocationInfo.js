import React, { Component } from 'react'
import mapService from '../services/map'


class LocationInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: ''
        }
        this.geocoder = new window.google.maps.Geocoder()
        this.addMarker = props.addMarker
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async getGeocode(event) {
        event.preventDefault()
        const address = await mapService.geocode(this.state.address)
        if (address.status === 'OK') {
            this.addMarker({ lat: address.results[0].geometry.location.lat, lng: address.results[0].geometry.location.lng })
            this.setState({
                address: ''
            })
        }
        // if (this.state.address !== '') {
        //     this.geocoder.geocode({ 'address': this.state.address }, (results, status) => {
        //         if (status === 'OK') {
        //             this.addMarker({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
        //             this.setState({
        //                 address: ''
        //             })
        //         }
        //     })
        // }
    }

    render() {
        return (
            <div style={{ border: '4px solid grey', maxWidth: '400px', margin: 'auto' }}><br />
                <form onSubmit={this.getGeocode.bind(this)} style={{ float: 'middle', margin: 'auto' }}>
                    <label style={{ fontSize: '18', fontWeight: 'bold' }}>Give address to add a waypoint</label><br />
                    <input type='text' className={'inputBar'} name='address' value={this.state.address} onChange={this.handleChange.bind(this)} placeholder={'Address..'} /><br /><br />
                    <input type='submit' value='Add waypoint' />
                </form><br />
            </div>
        )
    }
}

export default LocationInfo
