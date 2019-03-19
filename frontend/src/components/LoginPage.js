import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import { Redirect, NavLink, withRouter } from 'react-router-dom'
import { setLoggedUser } from '../reducers/authReducer'
import authService from '../services/auth'

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            loading: false,
            error: null
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
            const success = await authService.login({ username: event.target.username.value, password: event.target.password.value })

            if (success) {
                await this.props.setLoggedUser(success)
                this.props.history.push('/')
            }
        } catch (error) {
            console.log(error)
            this.setState({ loading: false, error: 'Invalid username or password', password: '' })
            setTimeout(() => {
                this.setState({error: null})
            }, 3000)
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
                        <input className="flex-item" type="username" name="username" onChange={this.handleChange} value={this.state.username} placeholder="Username"></input><br></br>
                        <input className="flex-item" type="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password"></input><br></br>
                        {this.state.loading ?
                            <div className="flex-item">
                                <Spinner style={{ margin: "auto" }} name='circle' fadeIn='none' color='white' />
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

export default connect(mapStateToProps, { setLoggedUser })(withRouter(LoginPage))