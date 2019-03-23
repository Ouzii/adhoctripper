import axios from 'axios'

let baseUrl = 'http://localhost:3000/api/trips'
// if (process.env.REACT_APP_LOCAL !== 'true') {
//     baseUrl = process.env.REACT_APP_BASE_URL+'/api/auth'
// } else {
//     baseUrl = `http://localhost:3000/api/auth`
// }
let token

const setToken = (idToken) => {
    token = idToken
}

const config = () => {
    return {
        headers: { 'Authorization': `bearer ${token}`, 'Token': token }
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

const getOwn = async () => {
    const response = await axios.get(`${baseUrl}/personal`, config())
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`, config())
    return response.data
}

const update = async (updatedTrip, id) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedTrip, config())
    return response.data
}

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`, config())
    return response
}

export default { getShared, remove, update, setToken, getOwn, saveOne, getOne}