const mongoose = require('mongoose');

const Schema = mongoose.Schema

const errorLogSchema = new Schema({
  errorStack: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);