import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'
import authService from '../services/auth'
import { notify } from '../reducers/notificationReducer'
import { setLoggedUser } from '../reducers/authReducer'

class ModifyAccountInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            password: '',
            newPassword: '',
            newPassword2: '',
            newEmail: this.props.loggedUser.email,
            passwordLoading: false,
            emailLoading: false
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handlePasswordChange = async (event) => {
        event.preventDefault()
        try {
            this.setState({
                passwordLoading: true
            })
            if (this.state.newPassword.length < 8 || this.state.newPassword !== this.state.newPassword2) {
                this.props.notify("New passwords must be 8 characters or over and match", 3000)
                this.setState({
                    passwordLoading: false
                })
                return
            }
            const newPasswords = {
                password: this.state.password,
                newPassword: this.state.newPassword,
                newPassword2: this.state.newPassword2
            }

            await authService.changePassword(newPasswords)
            this.props.notify("Password changed", 3000)
            this.setState({
                passwordLoading: false,
                password: '',
                newPassword: '',
                newPassword2: ''
            })
        } catch (error) {
            console.log(error)
            if (error.response) {
                this.props.notify(error.response.data.error, 3000)
                this.setState({
                    passwordLoading: false
                })
            } else if (error.message.message === "Offline") {
                this.props.notify("Password changed", 3000)
                this.setState({
                    passwordLoading: false,
                    password: '',
                    newPassword: '',
                    newPassword2: ''
                })
            }
        }
    }

    handleEmailChange = async (event) => {
        event.preventDefault()
        try {
            this.setState({
                emailLoading: true
            })

            const updatedUser = await authService.changeEmail(this.state.newEmail)
            this.props.notify("Email changed", 3000)
            this.props.setLoggedUser(updatedUser)
            this.setState({
                emailLoading: false
            })
        } catch (error) {
            console.log(error)
            if (error.response) {
                this.props.notify(error.response.data.error, 3000)
                this.setState({
                    emailLoading: false
                })
            } else if (error.message.message === "Offline") {
                this.props.notify("Email changed", 3000)
                this.props.setLoggedUser(error.message.body)
                this.setState({
                    emailLoading: false
                })
            }
        }
    }

    render() {
        return (
            <div className='modifyAccount'>
                <h2>Change password</h2>
                <form onSubmit={this.handlePasswordChange}>
                    <input type='password' required name='password' value={this.state.password} onChange={this.handleChange} placeholder='Current password' />
                    <input type='password' required minLength="8" maxLength="30" name='newPassword' value={this.state.newPassword} onChange={this.handleChange} placeholder='New password' />
                    <input type='password' required minLength="8" maxLength="30" name='newPassword2' value={this.state.newPassword2} onChange={this.handleChange} placeholder='Repeat new password' />
                    {this.state.passwordLoading ?
                        <Spinner style={{ margin: "auto" }} name='circle' fadeIn='none' color='white' />
                        :
                        <input className="flex-item" type="submit" value="Submit" disabled={this.state.newPassword.length >= 8 && this.state.newPassword === this.state.newPassword2 ? false : true} />
                    }
                </form><br /><br />
                <h2>Change email</h2>
                <form onSubmit={this.handleEmailChange}>
                    <input type='email' required name='newEmail' value={this.state.newEmail} onChange={this.handleChange} placeholder='New email' />
                    {this.state.emailLoading ?
                        <Spinner style={{ margin: "auto" }} name='circle' fadeIn='none' color='white' />
                        :
                        <input className="flex-item" type="submit" value="Submit" disabled={this.state.newEmail === this.props.loggedUser.email ? true : false} />
                    }
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedUser: state.loggedUser
})

export default connect(mapStateToProps, { notify, setLoggedUser })(ModifyAccountInfo)
