import React, { Component } from 'react'
import { connect } from 'react-redux'

class LocationInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
        this.geocoder = new window.google.maps.Geocoder()
        this.setLocations = props.setLocations()
        this.startAddress = React.createRef()
        this.endAddress = React.createRef()
    }

    // handleChange(event) {
    //     console.log(this.state)
    //     this.setState({
    //         [event.target.name]: event.target.value
    //     })
    // }

    getGeocode(event) {
        event.preventDefault()
        if (this.startAddress.current.value !== '') {
            this.geocoder.geocode({ 'address': this.startAddress.current.value }, (results, status) => {
                if (status === 'OK') {
                    results.type = 'origin'
                    this.setLocations(results)
                    this.startAddress.current.value = ''
                }
            })
        }

        if (this.endAddress.current.value !== '') {
            this.geocoder.geocode({ 'address': this.endAddress.current.value }, (results, status) => {
                if (status === 'OK') {
                    results.type = 'destination'
                    this.setLocations(results)
                    this.endAddress.current.value = ''
                }
            })
        }
    }

    render() {
        return (
            <div>
                {/* <h2>Start: {this.state.origin ? `${this.state.origin.lat}, ${this.state.origin.lng}` : ''}</h2>
                <h2>End: {this.state.destination ? `${this.state.destination.lat}, ${this.state.destination.lng}` : ''}</h2> */}
                <br/>
                <br/>
                <form onSubmit={this.getGeocode.bind(this)} style={{ float: 'middle', margin: 'auto'}}>
                    <label style={{ fontSize: '18', fontWeight: 'bold' }}>Start: </label><input type='text' name='startAddress' ref={this.startAddress} placeholder={'Give starting address'} /><br/>
                    <label style={{ fontSize: '18', fontWeight: 'bold' }}>End: </label><input type='text' name='endAddress' ref={this.endAddress} placeholder={'Give ending address'} /><br/>
                    <input type='submit' />
                </form>
                <br/>
                <br/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, null)(LocationInfo)
