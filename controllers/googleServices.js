const googleServicesRouter = require("express").Router();
const { googleApiKey } = require('../utils/config')
const GoogleMapsApi = require('googlemaps')

const googleApi = new GoogleMapsApi({
    key: googleApiKey,
    secure: true,
    encode_polylines: false
})


googleServicesRouter.post("/directions", async (request, response) => {
    try {
        if (request.body === undefined || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
            return response.status(400).json({ error: "Content missing" });
        }
        googleApi.directions({
            origin: `${request.body.origin.lat}, ${request.body.origin.lng}`,
            destination: `${request.body.destination.lat}, ${request.body.destination.lng}`,
            waypoints: request.body.middlePoints,
            travelMode: 'DRIVING'
        }, (err, result) => {
            if (err) {
                return response.status(400).send(err)
            } else if (result.status === 'OK') {
                return response.status(200).send(result)
            }
            return response.status(404).send()
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

        googleApi.geocode({
            address: request.body.address
        }, (err, result) => {
            if (err) {
                return response.status(400).send(err)
            } else if (result.status === 'OK') {
                return response.status(200).send(result)
            }
        })

    } catch (error) {
        console.log(error)
        response.status(400).send({ error: "Something went wrong, try again later" })
    }
})

googleServicesRouter.post("/geocode/reverse", async (request, response) => {
    try {
        if (request.body === undefined || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
            return response.status(400).json({ error: "Content missing" });
        }

        googleApi.reverseGeocode({
            latlng: `${request.body.lat}, ${request.body.lng}`
        }, (err, result) => {
            if (err) {
                return response.status(400).send(err)
            } else if (result.status === 'OK') {
                return response.status(200).send(result)
            }
        })
    } catch (error) {
        console.log(error)
        response.status(400).send({ error: "Something went wrong, try again later" })
    }
})

module.exports = googleServicesRouter;