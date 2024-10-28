
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  phoneNumber: { type: String },
  step: { type: Number, default: 0 },
  name: String,
  checkInDate: String,
  suite : String,
  nights: Number,
  comment: String
});

module.exports = mongoose.model('Session', sessionSchema);