const tripRouter = require("express").Router();
const Trip = require("../models/trip");
const jwt = require('jsonwebtoken');
const secret = require('../utils/config').secret;

tripRouter.get("/shared", async (request, response) => {
    try {
        const sharedTrips = await Trip.find({shared: true})
        return response.status(200).send(sharedTrips.map(trip => Trip.format(trip)))
    } catch (error) {
        console.log(error)
    }
})


tripRouter.get("/:id", async (request, response) => {
    try {
        const trip = await Trip.findById(request.params.id);
        if (trip.shared) {
            return response.status(200).send(Trip.format(trip));
        }

        let decoded = jwt.verify(request.headers.token, secret)
        if (trip.user === decoded.id) {
            return response.status(200).send(Trip.format(trip));
        }
        return response.status(403).send({error: 'Trip forbidden'});
    } catch (error) {
        console.log(error);
        response.status(400).send({ error: `Trip with id ${request.params.id} not found` });
    }
});

tripRouter.post("/", async (request, response) => {
    try {
        const body = request.body;
        if (body === undefined || (body.constructor === Object && Object.keys(body).length === 0)) {
            return response.status(400).json({ error: "Content missing" });
        }

        if(body.start === '' || body.start === undefined || body.end === undefined || body.end === '' 
        // || JSON.parse(body.directions).routes.length === 0
        ) {
            return response.status(400).json({ error: "Trip needs a route!"})
        }
        if (!body.user) {
            return response.status(403).json({ error: "Must be logged in"});
        }
        const trip = new Trip({
            name: body.name,
            description: body.description,
            start: body.start,
            end: body.end,
            startAddress: body.startAddress,
            endAddress: body.endAddress,
            // directions: body.directions,
            markers: body.markers,
            user: body.user
        });
        let newTrip = await trip.save();

        response.status(200).send(Trip.format(newTrip));
    } catch (error) {
        console.log(error);
        response.status(400).send({ error: "Something went wrong, try again later" });
    }
});

tripRouter.delete("/:id", async (request, response) => {
    try {
        const tripToBeDeleted = await Trip.findById(request.params.id);
        if (!tripToBeDeleted) {
            return response.status(404).send({ error: "Trip not found" });
        }
        await Trip.findOneAndDelete(Trip.findById(request.params.id));
        response.status(200).send(Trip.format(tripToBeDeleted));
    } catch (error) {
        console.log(error);
        response.status(400).send({ error: "Something went wrong, try again later" });
    }
});

module.exports = tripRouter;