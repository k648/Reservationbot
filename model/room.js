// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    //hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: String, required: true }, // e.g., Single, Double, Suite
    price: { type: Number, required: true },
    capacity: { type: Number, required: true }, // Number of guests
    amenities: [String],
    availability: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
