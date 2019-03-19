
import React from 'react'
import { Marker } from 'react-google-maps';
class Mark extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          markers: props.pos
            // lat: parseFloat(this.props.pos.lat),
            // lng: parseFloat(this.props.pos.lng)
        }

        console.log(this.state)
    }

    
  render() {
    return (
      <div>
        {this.state.markers.map(marker => (
          <Marker position={marker} key={`${marker.lat}, ${marker.lng}`}/>
        ))}
      </div>
      // <Marker position={this.state} />
    )
  }
}

export default Mark