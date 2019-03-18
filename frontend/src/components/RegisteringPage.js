import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import Spinner from 'react-spinkit'
import authService from '../services/auth'
import { setLoggedUser } from '../reducers/authReducer';

class RegisteringPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
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
            const newUser = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }
            const success = await authService.register(newUser)

            if (success) {
                this.props.setLoggedUser(success)
                this.props.history.push('/')
            }
        } catch (error) {
            console.log(error)
            this.setState({ loading: false, error: 'Something went wrong' })
            setTimeout(() =>
                this.setState({error: null})
            ,3000)
        }
    }

    render() {
        if (this.props.loggedUser) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <h1>Register</h1>
                <div style={{maxHeight: '35px'}}>
                {this.state.error ?
                <div className="alert alert-danger">{this.state.error}</div>
                :
                <div style={{padding: '18px'}}></div>
                }
                </div>
                <div className="flex-container">
                    <form onSubmit={this.handleSubmit}>
                        <input className="flex-item" type="text" name="username" minLength="5" onChange={this.handleChange} value={this.state.username} placeholder="Username"></input><br></br>
                        <input className="flex-item" type="email" name="email" onChange={this.handleChange} value={this.state.email} placeholder="Email"></input><br></br>
                        <input className="flex-item" type="password" name="password" minLength="8" maxLength="30" onChange={this.handleChange} value={this.state.password} placeholder="Password"></input><br></br>
                        {this.state.loading ?
                            <div className="flex-item">
                                <Spinner style={{ margin: "auto" }} name='circle' fadeIn='none' color='white' />
                            </div>

                            :
                            <input className="flex-item" type="submit" value="Submit"></input>
                        }
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})


export default connect(mapStateToProps, { setLoggedUser })(withRouter(RegisteringPage))
