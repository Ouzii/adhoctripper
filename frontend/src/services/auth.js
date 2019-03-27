import axios from 'axios'
import decode from 'jwt-decode'

let baseUrl = 'http://localhost:3000/api/auth'
if (process.env.NODE_ENV !== 'development') {
    baseUrl = 'https://adhoctripper.herokuapp.com/api/auth'
} else {
    baseUrl = `http://localhost:3000/api/auth`
}
let token


// axios.interceptors.request.use(req => {
//     console.log(req)
//     return req
// }, error => {
//     return Promise.reject(error)
// })

const setToken = (idToken) => {
    window.localStorage.setItem("id_token", JSON.stringify(idToken))
    token = idToken
}

const isTokenExpired = (token) => {
    try {
        const decoded = decode(token)
        if (decoded.exp < Date.now() / 1000) {
            return true
        } else return false
    } catch (err) {
        console.log(err)
        return false
    }
}

const config = () => {
    return {
        headers: { 'Authorization': `bearer ${token}`, 'Token': token }
    }
}

const register = async (newUser) => {
    const response = await axios.post(`${baseUrl}/register`, newUser)
    return response.data
}

const login = async (user) => {
    const response = await axios.post(`${baseUrl}/login`, user)
    return response.data
}

const remove = async () => {
    const response = await axios.delete(baseUrl, config())
    return response.data
}

const changePassword = async (newPasswords) => {
    const response = await axios.put(`${baseUrl}/password`, newPasswords, config())
    return response.data
}
const changeEmail = async (newEmail) => {
    const response = await axios.put(`${baseUrl}/email`, { newEmail: newEmail }, config())
    return response.data
}

export default { remove, setToken, register, login, isTokenExpired, changeEmail, changePassword }