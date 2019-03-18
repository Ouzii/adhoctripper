import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

export class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            loading: false
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value})
    }

    changeLoading = () => {
        this.setState({ loading: !this.state.loading })
    }
    handleSubmit = async (event) => {
        event.preventDefault()
        this.changeLoading()
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
            <div className="flex-container">
                <form onSubmit={this.handleSubmit}>
                    <input className="flex-item" type="username" name="username" onChange={this.handleChange} value={this.state.username} placeholder="Username"></input><br></br>
                    <input className="flex-item" type="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password"></input><br></br>
                    {this.state.loading ?
                        <div className="flex-item">
                            <Spinner style={{margin: "auto"}} name='circle' fadeIn='none' color= 'white'/>
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

})

export default connect(mapStateToProps, null)(LoginPage)
