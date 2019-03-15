const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    start: String,
    end: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
});

tripSchema.statics.format = trip => {
    return {
        start: trip.start,
        end: trip.end,
        user: trip.user
    };
};

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;