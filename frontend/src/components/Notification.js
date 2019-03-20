import React from 'react'
import { connect } from 'react-redux'

class Notification extends React.Component {
    render() {

        if (this.props.notification.length === 0) {
            return null
        }
        return <p>{this.props.notification}</p>
        
    }

}


const mapStateToProps = (state) => {
    return {
        notification: state.notification
    }
}

export default connect(mapStateToProps)(Notification)