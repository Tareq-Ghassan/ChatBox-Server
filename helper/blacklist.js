const mongoose = require('mongoose');

const Schema = mongoose.Schema

const blacklistSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: { type: Date, default: Date.now, expires: '7d' }
});

module.exports = mongoose.model('BlackList', blacklistSchema);