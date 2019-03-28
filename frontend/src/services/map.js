import axios from 'axios'

let baseUrl = 'http://localhost:3000/api/maps'
if (process.env.NODE_ENV !== 'development') {
    baseUrl = 'https://adhoctripper.herokuapp.com/api/maps'
}

const getDirections = async (trip) => {
    const response = await axios.post(`${baseUrl}/directions`, trip)
    return response.data
}

const geocode = async (address) => {
    const response = await axios.post(`${baseUrl}/geocode`, {address: address})
    return response.data
}

const reverseGeocode = async (location) => {
    const response = await axios.post(`${baseUrl}/geocode/reverse`, location)
    return response.data
}


export default { getDirections, geocode, reverseGeocode }