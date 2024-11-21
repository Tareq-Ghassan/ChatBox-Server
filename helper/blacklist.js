const mongoose = require('mongoose');

const Schema = mongoose.Schema

const blacklistSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
});

module.exports = mongoose.model('BlackList', blacklistSchema);