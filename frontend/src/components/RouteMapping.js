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
    if (!navigator.onLine) {
      return null
    }
    if (Object.entries(this.state.directions).length === 0 && this.state.directions.constructor === Object) {
      return null
    }
    return <DirectionsRenderer directions={this.state.directions} panel={this.state.panel.current} />
  }
}
