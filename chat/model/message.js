const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        //# Reference to the chat it belongs to
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        },
        //# Reference to the sender
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        messageType: {
            type: String,
            enum: ["text", "image", "video", "audio", "document", "sticker", "voiceNote", "location"],
            default: "text"
        },
        content: {
            type: String,
            //! Required if it's a text message
            required: function () {
                return this.messageType === "text";
            }
        },
        //# Used for image, video, audio, documents, and stickers
        mediaUrl: {
            type: String,
            default: null
        },
        location: {
            latitude: { type: Number, default: null },
            longitude: { type: Number, default: null }
        },
        //# Users who have seen this message
        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        //# Users who have deleted this message
        deletedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        isEdited: {
            type: Boolean,
            default: false
        },
        editedAt: {
            type: Date,
            default: null
        },
        editHistory: [
            {
                oldContent: { type: String, required: true },
                editedAt: { type: Date, default: Date.now }
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);