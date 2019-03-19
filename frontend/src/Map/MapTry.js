
import React from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Mark from '../components/Mark'
class MapTry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: parseFloat(this.props.pos.lat),
      lng: parseFloat(this.props.pos.lng)
    }

    this.markItem = React.createRef()
  }

  handleClick(event) {
    console.log('click')
    console.log(this.markItem)
    // this.markItem.setState({ lat: event.latLng.lat(), lng: event.latLng.lng() })
  }

  render() {

    return (
      <div>
        <MapWithMarker
          containerElement={<div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.8, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />}
          mapElement={<div style={{ height: `100%` }} />}
          position={this.state}
        />
      </div>
    )
  }
}

class MapWithMarker extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      position: props.position
    }
    this.markItem = React.createRef()
  }

  handleClick(event) {
    console.log('click')
    console.log(this.markItem)
    // this.markItem.setState({ lat: event.latLng.lat(), lng: event.latLng.lng() })
  }

  render() {

    const Mapp = withGoogleMap(props => {
      console.log(props)
      return (
      <GoogleMap
        defaultCenter={this.state.position}
        defaultZoom={10}
        onClick={(event) => this.markItem.current.setState({lat: event.latLng.lat(), lng: event.latLng.lng()})}
      >
      {props.marker}
        {/* <Mark pos={this.state.position} ref={this.markItem} /> */}
      </GoogleMap>
      )
      })
    return (
    <Mapp
      containerElement={<div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.8, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }} />}
      mapElement={<div style={{ height: `100%` }} />}
      marker={<Mark pos={this.state.position} ref={this.markItem}/>}
    />
    )
  }
}



// handleClick(event) {
//   this.markItem.setState({ lat: event.latLng.lat(), lng: event.latLng.lng() })
// }

// render() {
//   const MapWithMarker = withGoogleMap(props => (

//     <GoogleMap
//       style={{ height: `100%` }}
//       defaultCenter={this.state}
//       defaultZoom={10}
//       onClick={this.handleClick}
//     >
//       <Mark pos={this.state} ref={this.markItem} />
//     </GoogleMap>
//   ));



//   return (
//     <div style={{ width: window.innerWidth * 0.8, height: window.innerWidth * 0.8, maxHeight: '400px', maxWidth: '400px', margin: 'auto' }}>
//       <GoogleMap
//         style={{ height: `100%` }}
//         defaultCenter={this.state}
//         defaultZoom={10}
//         onClick={this.handleClick}
//       >
//         <Mark pos={this.state} ref={this.markItem} />
//       </GoogleMap>
//     </div>
//   )
// }

export default MapTry