const mongoose = require('mongoose');

const Schema = mongoose.Schema

const storyScheme = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },
    expirationDate: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000,
    },
    viewers: [
        {
            viewerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            viewedAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Story', storyScheme)