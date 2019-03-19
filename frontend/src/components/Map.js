
import React from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: parseFloat(this.props.pos.lat),
            lng: parseFloat(this.props.pos.lng),
            markers: this.props.markers
        }
    }

    
  render() {
    const MapWithMarker = withGoogleMap(props => (
        
        <GoogleMap
          defaultCenter = { this.state }
          defaultZoom = { 10 }
          mark
          onClick = {this.props.onClick}
        >
        {this.state.markers.map(marker => {
            return <Marker position={marker} key={marker.lat}/>
        })}
        {/* <Marker position={ this.state } /> */}
        </GoogleMap>
     ));
    
      
    return (
      <div>
        <MapWithMarker
          containerElement={ <div style={{ height: `400px`, width: '400px', margin: 'auto' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
        />
      </div>
    )
  }
}

export default Map