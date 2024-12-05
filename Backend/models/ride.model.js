const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    vehicleType: { type: String, enum: ['auto', 'car', 'moto'], required: true },
    fare: { type: Number, required: true },
    otp: { type: String, required: true },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'ongoing', 'completed', 'cancelled'], // Add 'requested' here
        default: 'requested'
    },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' }
});

module.exports = mongoose.model('Ride', rideSchema);
