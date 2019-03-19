
import React from 'react'
import { Marker } from 'react-google-maps';
class Mark extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          markers: props.markers
        }
    }

    
  render() {
    return (
      <div>
        {this.state.markers.map(marker => (
          <Marker position={marker} key={`${marker.lat}, ${marker.lng}`}/>
        ))}
      </div>
    )
  }
}

export default Mark