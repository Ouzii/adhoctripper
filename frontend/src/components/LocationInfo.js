import React, { Component } from 'react'
import { connect } from 'react-redux'

class LocationInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address:''
        }
        this.geocoder = new window.google.maps.Geocoder()
        this.addMarker = props.addMarker
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
                    this.addMarker({lat:results[0].geometry.location.lat(), lng:results[0].geometry.location.lng()})
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
                <form onSubmit={this.getGeocode.bind(this)} style={{ float: 'middle', margin: 'auto'}}>
                    <label style={{ fontSize: '18', fontWeight: 'bold' }}>Address </label><br/>
                    <input type='text' className={'inputBar'} name='address' value={this.state.address} onChange={this.handleChange.bind(this)} placeholder={'Address..'} /><br/><br/>
                    <input type='submit' value='Add waypoint'/>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, null)(LocationInfo)
