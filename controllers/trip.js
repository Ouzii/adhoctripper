const tripRouter = require("express").Router();
const Trip = require("../models/trip");

tripRouter.get("/", async (request, response) => {
    return response.status(200).send("TRIPS FOR ALL!")
})
tripRouter.get("/:id", async (request, response) => {
    try {
        const trip = await Trip.findById(request.params.id);
        return response.status(200).send(Trip.format(trip));
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

        if(body.start === '' || body.start === undefined || body.end === undefined || body.end === '' || JSON.parse(body.directions).routes.length === 0) {
            return response.status(400).json({ error: "Trip needs a route!"})
        }
        if (!body.user) {
            return response.status(403).json({ error: "Must be logged in"});
        }
        const trip = new Trip({
            start: body.start,
            end: body.end,
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