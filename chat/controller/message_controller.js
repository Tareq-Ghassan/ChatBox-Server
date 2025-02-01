const Message = require('../model/message');
const Chat = require('../model/chat');

exports.getMessages = async (req, res, next) => {
    try {
        const { chatId, perPage, index } = req.body;
        const messages = await Message.find({ chatId })
            .sort({ createdAt: -1 })
            .skip((index - 1) * perPage)
            .limit(perPage)
            .populate("sender", "name profileImage");

        const totalMessages = await Message.countDocuments({ chatId: chatId });

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
            body: {
                messages: messages,
                totalMessages: totalMessages,
                perPage: Number(perPage),
                currentPage: Number(index),
                totalPages: Math.ceil(totalMessages / perPage),
            }
        });
    } catch (error) {
        console.error('Error fetching messages', error);
        next(error);
    }

}

exports.sendMessage = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ _id: chatId, participants: senderId });
        const { chatId, messageType, content, mediaUrl, location } = req.body;
        const message = new Message({
            chatId,
            sender: req.user.id,
            messageType,
            content: content || null,
            mediaUrl: mediaUrl || null,
            location: location || null
        });

        chat.lastMessage = message._id;
        await message.save();

        const io = require("../../socket").getIO();
        io.to(chatId).emit("message:new", message);

        return res.status(201).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
            body: message
        });

    } catch (error) {
        console.error('Error send message', error);
        next(error);
    }

}


exports.editMessage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId, newContent } = req.body;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                header: { errorCode: '404', message: "Bad Request, Message not found" }
            });
        }
        if (message.sender.toString() !== userId) {
            return res.status(403).json({
                header: { errorCode: '403', message: "Unauthorized to edit this message" }
            });
        }
        message.editHistory.push({
            oldContent: message.content,
            editedAt: new Date()
        });

        message.content = newContent;
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();

        const io = require("../../socket").getIO();
        io.to(message.chatId.toString()).emit("message:edited", {
            messageId,
            newContent,
            editedAt: message.editedAt,
            editHistory: message.editHistory
        });

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
            editedMessage: message
        });

    } catch (error) {
        console.error('Error edit message', error);
        next(error);
    }
}

exports.deleteMessage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.body;

        if (!messageId) {
            return res.status(400).json({
                header: { errorCode: '400', message: "Bad Request, messageId is required" }
            });
        }

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                header: { errorCode: '404', message: "Bad Request, Message not found" }
            });
        }
        if (message.sender.toString() !== userId) {
            return res.status(403).json({
                header: { errorCode: '403', message: "Unauthorized to edit this message" }
            });
        }


        if (!message.deletedBy.includes(userId)) {
            message.deletedBy.push(userId);
            await message.save();
        }

        const io = require("../../socket").getIO();
        io.to(message.chatId.toString()).emit("message:deleted", { messageId, deletedBy: userId });

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
        });

    } catch (error) {
        console.error('Error delete message', error);
        next(error);
    }
}

exports.markMessageAsSeen = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.body;

        if (!messageId) {
            return res.status(400).json({
                header: { errorCode: '400', message: "Bad Request, messageId is required" }
            });
        }

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                header: { errorCode: '404', message: "Bad Request, Message not found" }
            });
        }


        const chat = await Chat.findOne({ _id: message.chatId, participants: userId });

        if (!chat) {
            return res.status(403).json({
                header: { errorCode: '403', message: "Unauthorized to mark message as seen" }
            });
        }

        if (!message.seenBy.includes(userId)) {
            message.seenBy.push(userId);
            await message.save();
        }

        const io = require("../../socket").getIO();
        io.to(message.chatId.toString()).emit("message:seen", {
            messageId,
            seenBy: message.seenBy
        });

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
            body: message.seenBy
        });

    } catch (error) {
        console.error('Error delete message', error);
        next(error);
    }
}
