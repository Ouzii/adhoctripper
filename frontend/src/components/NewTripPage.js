import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Map from './Map'
import tripService from '../services/trip'
import { notify } from '../reducers/notificationReducer'

class NewTripPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pos: null
        }

        this.mapItem = React.createRef()
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

    saveTrip = async () => {
            const newTrip = {
                start: JSON.stringify(this.mapItem.current.markers[0]),
                end: JSON.stringify(this.mapItem.current.markers[this.mapItem.current.markers.length - 1]),
                directions: JSON.stringify(this.mapItem.current.directions),
                user: this.props.loggedUser ? this.props.loggedUser.id : null
            }

            try {
                await tripService.saveOne(newTrip)
                this.mapItem.current.resetAll()
                this.props.notify("Trip saved", 3000)
            } catch (error) {
                this.props.notify(error.response.data.error, 3000)
            }
    }

    render() {
        return (
            <div>
                {this.state.pos ?
                    <div>
                        <Map pos={this.state.pos} saveTrip={this.saveTrip.bind(this)} loggedUser={this.props.loggedUser} ref={this.mapItem} />
                    </div>
                    : <div></div>
                }
                {this.props.loggedUser ? <button onClick={() => this.saveTrip()}>Save Trip</button> : null}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})


export default connect(mapStateToProps, { notify })(withRouter(NewTripPage))
