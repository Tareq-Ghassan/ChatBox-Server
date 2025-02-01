const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        //# Reference to the last message sent in this chat
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        //? True if it's a group chat, false if it's a private chat
        isGroup: {
            type: Boolean,
            default: false
        },
        //# Only used if it's a group chat
        groupName: {
            type: String,
            default: null
        },
        //# URL to the group profile image
        groupImage: {
            type: String,
            default: null
        },
        //# Users who archived the chat
        archivedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        //# Users who muted the chat
        mutedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        deletedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);