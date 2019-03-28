import axios from 'axios'

let baseUrl = 'http://localhost:3000/api/weather'
if (process.env.NODE_ENV !== 'development') {
    baseUrl = 'https://adhoctripper.herokuapp.com/api/weather'
}

const getWeather = async (location) => {
    const response = await axios.post(baseUrl, location)
    return response.data
}


export default { getWeather }