import axios from 'axios'

let baseUrl = 'http://localhost:3000/api/account'
if (process.env.NODE_ENV !== 'development') {
    baseUrl = 'https://adhoctripper.herokuapp.com/api/account'
} else {
    baseUrl = `http://localhost:3000/api/account`
}
let token



const setToken = (idToken) => {
    window.localStorage.setItem("id_token", JSON.stringify(idToken))
    token = idToken
}

const config = () => {
    return {
        headers: { 'Authorization': `bearer ${token}`, 'Token': token }
    }
}

const getAccount = async () => {
    const response = await axios.get(baseUrl, config())
    return response.data
}
const updateVehicles = async (updatedUser, id) => {
    const response = await axios.put(`${baseUrl}/vehicles/${id}`, updatedUser, config())
    return response.data
}

const updateEstFuelPrice = async (updatedUser, id) => {
    const response = await axios.put(`${baseUrl}/fuel/${id}`, updatedUser, config())
    return response.data
}

export default { updateVehicles, updateEstFuelPrice, setToken, getAccount }