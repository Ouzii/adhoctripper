import React, { Component } from 'react'

class TripInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            description: ''
        }
        this.geocoder = new window.google.maps.Geocoder()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    getGeocode(event) {
        event.preventDefault()
        if (this.state.address !== '') {
            this.geocoder.geocode({ 'address': this.state.address }, (results, status) => {
                if (status === 'OK') {
                    this.addMarker({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
                    this.setState({
                        address: ''
                    })
                }
            })
        }
    }

    render() {
        return (
            <div>
                <label style={{ fontSize: '18', fontWeight: 'bold' }}>Name your trip</label><br />
                <input type='text' className={'inputBar'} name='name' value={this.state.name} onChange={this.handleChange.bind(this)} placeholder={'Name..'} /><br />
                <label style={{ fontSize: '18', fontWeight: 'bold' }}>Description</label><br />
                <input type='text' className={'inputBar'} name='description' value={this.state.description} onChange={this.handleChange.bind(this)} placeholder={'Description..'} /><br /><br />
            </div>
        )
    }
}

export default TripInfo