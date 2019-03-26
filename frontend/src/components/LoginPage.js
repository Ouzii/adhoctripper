import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import { Redirect, NavLink, withRouter } from 'react-router-dom'
import { setLoggedUser } from '../reducers/authReducer'
import { setSharedTrips } from '../reducers/sharedTripsReducer'
import { setPersonalTrips } from '../reducers/personalTripsReducer'
import { notify } from '../reducers/notificationReducer'
import authService from '../services/auth'
import tripService from '../services/trip'
import accountService from '../services/account';

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            loading: false,
            error: null
        }

        this.timeout = null
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    changeLoading = () => {
        this.setState({ loading: !this.state.loading })
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        this.changeLoading()
        try {
            const response = await authService.login({ username: event.target.username.value, password: event.target.password.value })
            if (response.user) {
                await this.props.setLoggedUser(response.user)
                this.props.notify(`Logged in as ${response.user.username}`, 3000)
                authService.setToken(response.token)
                tripService.setToken(response.token)
                accountService.setToken(response.token)
                this.props.history.push('/')
                const personalTrips = await tripService.getPersonal()
                this.props.setPersonalTrips(personalTrips)
                const sharedTrips = await tripService.getShared()
                this.props.setSharedTrips(sharedTrips)
            }
        } catch (error) {
            console.log(error)
            this.setState({ loading: false, error: error.response.data.error, password: '' })
            this.timeout = setTimeout(() => (
                this.setState({error: null})
            ).bind(this), 3000)
        }
    }

    render() {
        if (this.props.loggedUser) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <h1>Login</h1>
                <div style={{maxHeight: '35px'}}>
                {this.state.error ?
                <div className="alert alert-danger">{this.state.error}</div>
                :
                <div style={{padding: '18px'}}></div>
                }
                </div>
                <div className="flex-container">
                    <form onSubmit={this.handleSubmit}>
                        <input className="flex-item" required type="username" name="username" onChange={this.handleChange} value={this.state.username} placeholder="Username"></input><br></br>
                        <input className="flex-item" required type="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password"></input><br></br>
                        {this.state.loading ?
                            <div className="flex-item" style={{width: '100%'}}>
                                <Spinner style={{ marginLeft: "43%"}} name='circle' fadeIn='none' color='white' />
                            </div>

                            :
                            <input className="flex-item" type="submit" value="Submit"></input>
                        }
                    </form>
                </div>

                <br></br>
                <NavLink to="/register" className="navlink">Not registered yet?</NavLink>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})

export default connect(mapStateToProps, { setLoggedUser, notify, setSharedTrips, setPersonalTrips })(withRouter(LoginPage))
