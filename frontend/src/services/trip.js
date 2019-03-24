import axios from 'axios'

let baseUrl = 'http://localhost:3000/api/trips'
if (process.env.REACT_APP_LOCAL !== 'true') {
    baseUrl = 'https://adhoctripper.herokuapp.com/api/trips'
} else {
    baseUrl = `http://localhost:3000/api/trips`
}
let token

const setToken = (idToken) => {
    token = idToken
}
const checkIfTokenInLocal = () => {
    const token = JSON.parse(window.localStorage.getItem('id_token'))
    if (token) {
        setToken(token)
    }
}

const config = () => {
    if (token) {
        return {
            headers: { 'Authorization': `bearer ${token}`, 'Token': token }
        }
    } else {
        return null
    }
}

const saveOne = async (trip) => {
    const response = await axios.post(baseUrl, trip, config())
    return response.data
}

const getShared = async () => {
    const response = await axios.get(`${baseUrl}/shared`)
    return response.data
}

const getPersonal = async () => {
    const response = await axios.get(`${baseUrl}/personal`, config())
    return response.data
}

const getOne = async (id) => {
    if(token) {
        const response = await axios.get(`${baseUrl}/${id}`, config())
        return response.data
    }
    return setTimeout(() => {
            getOne(id)
        }, 3000)
}

const update = async (updatedTrip, id) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedTrip, config())
    return response.data
}

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`, config())
    return response.data
}

export default { getShared, remove, update, setToken, getPersonal, saveOne, getOne, checkIfTokenInLocal}