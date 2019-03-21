import axios from 'axios'
import decode from 'jwt-decode'

let baseUrl = 'http://localhost:3000/api/auth'
// if (process.env.REACT_APP_LOCAL !== 'true') {
//     baseUrl = process.env.REACT_APP_BASE_URL+'/api/auth'
// } else {
//     baseUrl = `http://localhost:3000/api/auth`
// }
let token

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

// const getAll = async () => {
//     const response = await axios.get(baseUrl)
//     return response.data
// }

// const getOne = async (id) => {
//     const response = await axios.get(`${baseUrl}/${id}`)
//     return response.data
// }

const update = async (updatedUser, id) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedUser, config())
    return response.data
}

const remove = async () => {
    const response = await axios.delete(baseUrl, config())
    return response
}

export default { remove, update, setToken, register, login, isTokenExpired }