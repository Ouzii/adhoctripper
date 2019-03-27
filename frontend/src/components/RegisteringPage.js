import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import Spinner from 'react-spinkit'
import authService from '../services/auth'
import tripService from '../services/trip'
import { setLoggedUser } from '../reducers/authReducer'
import { notify } from '../reducers/notificationReducer'
import accountService from '../services/account';

class RegisteringPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            password2: '',
            loading: false,
            error: null
        }

        this.timeout = null
    }

    componentWillUnmount() {
        if (this.timeout) {
            this.timeout = null
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    changeLoading = () => {
        this.setState({ loading: !this.state.loading })
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        this.changeLoading()
        try {
            if (this.state.password !== this.state.password2) {
                this.props.notify("Passwords don't match", 3000)
                this.changeLoading()
                return
            }
            const newUser = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }
            const registeredUser = await authService.register(newUser)

            if (registeredUser) {
                this.props.history.push('/')
                this.props.setLoggedUser(registeredUser.user)
                authService.setToken(registeredUser.token)
                tripService.setToken(registeredUser.token)
                accountService.setToken(registeredUser.token)
                this.props.notify(`Registered and logged in as ${registeredUser.user.username}`, 3000)
            }
        } catch (error) {
            if (error.response) {
                this.setState({ loading: false, error: error.response.data.error })
                this.timeout = setTimeout(() => (
                    this.setState({ error: null })
                ).bind(this), 3000)
            } else if (error.message.message === "Offline") {
                this.setState({
                    loading: false,
                    error: "You're offline! Try again later",
                    password: '',
                    password2: ''
                })
                this.timeout = setTimeout(() => (
                    this.setState({ error: null })
                ).bind(this), 3000)
            }
        }
    }

    render() {
        if (this.props.loggedUser) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <h1>Register</h1>
                <div style={{ maxHeight: '35px' }}>
                    {this.state.error ?
                        <div className="alert alert-danger">{this.state.error}</div>
                        :
                        <div style={{ padding: '18px' }}></div>
                    }
                </div>
                <div className="flex-container">
                    <form onSubmit={this.handleSubmit}>
                        <input className="flex-item" required type="text" name="username" minLength="5" onChange={this.handleChange} value={this.state.username} placeholder="Username"></input><br></br>
                        <input className="flex-item" required type="email" name="email" onChange={this.handleChange} value={this.state.email} placeholder="Email"></input><br></br>
                        <input className="flex-item" required type="password" name="password" minLength="8" maxLength="30" onChange={this.handleChange} value={this.state.password} placeholder="Password"></input><br></br>
                        <input className="flex-item" required type="password" name="password2" minLength="8" maxLength="30" onChange={this.handleChange} value={this.state.password2} placeholder="Re-enter password"></input><br></br>
                        {this.state.loading ?
                            <Spinner style={{ margin: "auto" }} name='circle' fadeIn='none' color='white' />
                            :
                            <input className="flex-item" type="submit" value="Submit" disabled={this.state.password.length >= 8 && this.state.password === this.state.password2 ? false : true}></input>
                        }
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser,
    notification: state.notification
})


export default connect(mapStateToProps, { setLoggedUser, notify })(withRouter(RegisteringPage))
