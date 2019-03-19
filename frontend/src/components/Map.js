
import React from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Mark from './Mark'
class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: parseFloat(this.props.pos.lat),
            lng: parseFloat(this.props.pos.lng)
        }
        this.markItem = React.createRef()
        this.getMarkers = props.getMarkers
    }


    render() {
        const MapWithMarker = withGoogleMap(props => (
            <GoogleMap
                defaultCenter={props.position}
                defaultZoom={10}
                onClick={(event) => {
                    const markers = this.markItem.current.state.markers
                    markers.push({ lat: event.latLng.lat(), lng: event.latLng.lng() })
                    this.markItem.current.setState(markers)
                    props.giveMarkers(markers)
                }}
            >
                {props.marker}
            </GoogleMap>
        ));


        return (
            <div>
                <MapWithMarker
                    containerElement={<div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.8, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    position={this.state}
                    marker={<Mark pos={[this.state]} ref={this.markItem} />}
                    giveMarkers={this.getMarkers.bind(this)}
                />
            </div>
        )
    }
}

export default Map