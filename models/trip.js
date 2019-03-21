const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    name: String,
    description: String,
    start: String,
    end: String,
    startAddress: String,
    endAddress: String,
    // directions: String,
    markers: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    shared: { type: Boolean, default: false }
});

tripSchema.statics.format = trip => {
    return {
        id: trip._id,
        name: trip.name,
        description: trip.description,
        start: JSON.parse(trip.start),
        end: JSON.parse(trip.end),
        startAddress: trip.startAddress,
        endAddress: trip.endAddress,
        markers: JSON.parse(trip.markers),
        // directions: trip.directions,
        user: trip.user,
        shared: trip.shared
    };
};

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;