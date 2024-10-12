const mongoose = require('mongoose');

const Schema = mongoose.Schema

const serverConnectionSchema = new Schema({
    appKey: {
        type: String,
        required: true
    },
    appSecret: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('serverConnection', serverConnectionSchema); 