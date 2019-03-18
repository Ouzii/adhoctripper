import axios from 'axios'

let baseUrl = 'http://localhost:3000/api/auth'
// if (process.env.REACT_APP_LOCAL !== 'true') {
//     baseUrl = process.env.REACT_APP_BASE_URL+'/api/auth'
// } else {
//     baseUrl = `http://localhost:3000/api/auth`
// }
let token

const setToken = (props) => {
    token = `bearer ${props.token}`
}

const config = () => {
    return {
        headers: { 'Authorization': token }
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

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

const update = async (updatedUser, id) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedUser, config())
    return response.data
}

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`, config())
    return response
}

export default { getAll, remove, update, setToken, getOne, register, login }