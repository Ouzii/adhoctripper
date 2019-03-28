/*global google*/
const googleServicesRouter = require("express").Router();
const { googleApiKey } = require('../utils/config')
const googleMapsClient = require('@google/maps').createClient({
    key: googleApiKey
})



googleServicesRouter.post("/directions", async (request, response) => {
    try {
        if (request.body === undefined || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
            return response.status(400).json({ error: "Content missing" });
        }

        return googleMapsClient.directions({
            origin: `${request.body.origin.lat}, ${request.body.origin.lng}`,
            destination: `${request.body.destination.lat}, ${request.body.destination.lng}`,
            waypoints: request.body.middlePoints,
            mode: 'driving'
        }, (err, res) => {
            if (err) {
                return response.status(400).send(err.json.status)
            } else if (res.json.status === 'OK') {
                return response.status(200).send(res)
            }
            return response.status(400).send()
        })


    } catch (error) {
        console.log(error)
        response.status(400).send({ error: "Something went wrong, try again later" });
    }
})

googleServicesRouter.post("/geocode", async (request, response) => {
    try {
        if (request.body === undefined || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
            return response.status(400).json({ error: "Content missing" });
        }

        return googleMapsClient.geocode({
            address: request.body.address
        }, (err, res) => {
            if (err) {
                return response.status(400).send(err.json.status)
            } else if (res.json.status === 'OK') {
                return response.status(200).send(res.json)
            }
            return response.status(400).send()
        })

    } catch (error) {
        console.log(error)
        response.status(400).send({ error: "Something went wrong, try again later" })
    }
})

module.exports = googleServicesRouter;