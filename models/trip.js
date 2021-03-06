const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    name: String,
    description: String,
    start: String,
    end: String,
    startAddress: String,
    endAddress: String,
    markers: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    shared: { type: Boolean, default: false },
    saved: { type: Date, default: Date.now },
    length: Number
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
        user: trip.user,
        shared: trip.shared,
        saved: trip.saved,
        length: trip.length
    };
};

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;