const mongoose = require('mongoose');

// Define the schema for user feedback
const feedbackSchema = new mongoose.Schema({
  name: String,
  comment: String,
  phone: String,

});


module.exports = mongoose.model('Feedback', feedbackSchema);