const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    start: String,
    end: String,
    directions: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
});

tripSchema.statics.format = trip => {
    return {
        start: trip.start,
        end: trip.end,
        directions: trip.directions,
        user: trip.user
    };
};

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;