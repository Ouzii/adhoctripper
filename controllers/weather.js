const weatherRouter = require("express").Router();
const axios = require('axios')
const { weatherApiKey } = require('../utils/config')

weatherRouter.post("/", async (request, response) => {
    try {   
        if (!request.body) {
            return response.status(400).json({ error: 'Missing content' })
        }
        const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${request.body.lat}&lon=${request.body.lng}&units=metric&appid=${weatherApiKey}`)
        return response.status(200).json({ description: weather.data.weather[0].description, temperature: weather.data.main.temp, wind: weather.data.wind.speed })
    } catch (error) {
        console.log(error)
        response.status(400).send({ error: 'Something went wrong, try again later' })
    }
})

module.exports = weatherRouter;