const Chat = require('../model/chat');


exports.checkIfChatIdExist = (req, res, next) => {
    //? missing || null request parameter checks
    if (req.body.chatId == null || req.body.chatId.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, chatId can't be empty or null"
            }
        });
    }
    next();
}

exports.checkIfIndexAndPerPageExist = (req, res, next) => {
    //? missing || null request parameter checks
    if (req.body.index == null || req.body.index.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, index can't be empty or null"
            }
        });
    } else if (req.body.perPage == null || req.body.perPage.toString().trim() === '') {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, perPage can't be empty or null"
            }
        });
    }
    //? data type request parameter checks
    else if (isNaN(req.body.index) || !Number.isInteger(Number(req.body.index))) {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, index should be integer"
            }
        });
    } else if (isNaN(req.body.perPage) || !Number.isInteger(req.body.perPage)) {
        return res.status(400).json({
            header: {
                errorCode: '400',
                message: "Bad Request, perPage should be integer"
            }
        });
    }
    next();
}


exports.checkIfChatIdCorrect = async (req, res, next) => {
    const chat = await Chat.findOne({ _id: req.body.chatId, participants: req.user.id });

    if (!chat) {
        return res.status(500).json({
            header: { errorCode: '404', message: "Chat not found or unauthorized" }
        });
    }
}


exports.sendMessageRequest = (req, res, next) => {
    const { messageType, content, mediaUrl, location } = req.body;

    if (!messageType || !["text", "image", "video", "audio", "document", "sticker", "voiceNote", "location"].includes(messageType)) {
        return res.status(400).json({
            header: { errorCode: '400', message: "Bad Request, Invalid message type" }
        });
    }
    if (messageType === "text" && (!content || content.trim() === "")) {
        return res.status(400).json({
            header: { errorCode: '400', message: "Bad Request, Content is required for text messages" }
        });
    }
    if (["image", "video", "audio", "document", "sticker", "voiceNote"].includes(messageType) && !mediaUrl) {
        return res.status(400).json({
            header: { errorCode: '400', message: "Bad Request, Media URL is required for this message type" }
        });
    }
    if (messageType === "location" && (!location || location.latitude === undefined || location.longitude === undefined)) {
        return res.status(400).json({
            header: { errorCode: '400', message: "Bad Request, Latitude and longitude are required for location messages" }
        });
    }

}

exports.editMessageRequest = async (req, res, next) => {
    const { messageId, newContent } = req.body;
    if (!messageId) {
        return res.status(400).json({
            header: { errorCode: '400', message: "Bad Request, messageId is required" }
        });
    }
    if (!newContent || newContent.trim() === "") {
        return res.status(400).json({
            header: { errorCode: '400', message: "Bad Request, New content is required" }
        });
    }
}
