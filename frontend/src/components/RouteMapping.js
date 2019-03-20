import React, { Component } from 'react'
import { DirectionsRenderer } from 'react-google-maps'

export default class RouteMapping extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         directions: {},
         panel: props.panel
      }
    }
    


  render() {
    return (
        <DirectionsRenderer directions={this.state.directions} panel={this.state.panel.current}/>
    )
  }
}
