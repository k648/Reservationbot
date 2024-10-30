const mongoose = require('mongoose');

const cancelledReservationSchema = new mongoose.Schema({
  phoneNumber: { type: String },
  step: { type: Number, default: 0 },
  name: String,
  checkInDate: String,
  suite: String,
  nights: Number,
  comment: String
});

// Remove the period at the end of the model name
module.exports = mongoose.model('CancelledReservation', cancelledReservationSchema);
