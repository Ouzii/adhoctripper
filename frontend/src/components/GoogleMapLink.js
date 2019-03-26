import React, { Component } from 'react'

export default class GoogleMapLink extends Component {
    constructor(props) {
        super(props)

        this.state = {
            googleLink: 'https://www.google.com/maps/dir/'
        }
    }

    updateLink = (markers) => {
        let googleLink = `https://www.google.com/maps/dir/${markers.origin.location.lat},${markers.origin.location.lng}/`
        markers.result.request.waypoints.forEach(marker => {
            googleLink = googleLink + `${marker.location.location.lat()},${marker.location.location.lng()}/`
        })
        googleLink = googleLink + `${markers.destination.location.lat},${markers.destination.location.lng}`
        this.setState({
            googleLink
        })
    }

    render() {
        return (
            <div>
            {
                this.state.googleLink !== 'https://www.google.com/maps/dir/' ?
                    <div className="googleLink">
                        <a href={this.state.googleLink} title="Google Maps" target="_blank" rel="noopener noreferrer">Open in google</a>
                    </div>
                    :
                    null
            }
            </div>
        )
    }
}
