import React from 'react'
import { connect } from 'react-redux'

class Notification extends React.Component {
    render() {

        return (
            <div style={{height: '10vmin'}}>
                {this.props.notification.length !== 0 ?
                    <div>{this.props.notification}</div>
                    :
                    <div />
                }
            </div>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        notification: state.notification
    }
}

export default connect(mapStateToProps)(Notification)