import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class TripHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
       loggedUser: null
    }
  }
  

  render() {
    return (
      <div>
        
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loggedUser: state.loggedUser
})


export default connect(mapStateToProps, null)(TripHistory)

