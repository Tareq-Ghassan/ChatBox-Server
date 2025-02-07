const Chat = require('../model/chat');
const Message = require('../model/message');


exports.getAllChats = async (req, res, next) => {
    try {
        const { perPage, index } = req.query;
        const chats = await Chat.find({ participants: req.user.id })
            .populate("lastMessage")
            .populate("participants", "name profileImage")
            .sort({ updatedAt: -1 })
            .skip((index - 1) * perPage)
            .limit(perPage);

        const totalChats = await Chat.countDocuments({ participants: req.user.id });

        const modifiedChats = await Promise.all(chats.map(async (chat) => {
            const unreadMessagesCount = await Message.countDocuments({
                chatId: chat._id,
                isRead: false,
                receiver: req.user.id,
            });
            const { archivedBy, mutedBy, deletedBy, ...chatData } = chat._doc;
            return {
                ...chatData,
                participants: chat.participants.filter(p => p._id.toString() !== req.user.id),
                unreadMessagesCount,
                isArchived: chat.archivedBy.includes(req.user.id),
                isMuted: chat.mutedBy.includes(req.user.id),
                isDeleted: chat.deletedBy.includes(req.user.id),
            };
        }));

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
            chats: modifiedChats,
            currentPage: Number(index),
            perPage: Number(perPage),
            totalChats: totalChats,
            totalPages: Math.ceil(totalChats / perPage),
        });

    } catch (error) {
        console.error('Error fetching chats', error);
        next(error);
    }

}


exports.archive = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ _id: req.body.chatId, participants: req.user.id });

        if (!chat) {
            return res.status(500).json({
                header: { errorCode: '404', message: "Chat not found or unauthorized" }
            });
        }
        if (!chat.archivedBy.includes(req.user.id)) {
            chat.archivedBy.push(req.user.id);
            await chat.save();
        }
        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
        });
    } catch (error) {
        console.error('Error in archive a chat', error);
        next(error);
    }
}


exports.unarchive = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ _id: req.body.chatId, participants: req.user.id });

        if (!chat) {
            return res.status(500).json({
                header: { errorCode: '404', message: "Chat not found or unauthorized" }
            });
        }

        chat.archivedBy = chat.archivedBy.filter(id => id.toString() !== req.user.id);
        await chat.save();

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
        });
    } catch (error) {
        console.error('Error in unArchive a chat', error);
        next(error);
    }

}

exports.mute = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ _id: req.body.chatId, participants: req.user.id });

        if (!chat) {
            return res.status(500).json({
                header: { errorCode: '404', message: "Chat not found or unauthorized" }
            });
        }
        if (!chat.mutedBy.includes(req.user.id)) {
            chat.mutedBy.push(req.user.id);
            await chat.save();
        }

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
        });
    } catch (error) {
        console.error('Error in mute a chat', error);
        next(error);
    }

}


exports.unMute = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ _id: req.body.chatId, participants: req.user.id });

        if (!chat) {
            return res.status(500).json({
                header: { errorCode: '404', message: "Chat not found or unauthorized" }
            });
        }

        chat.mutedBy = chat.mutedBy.filter(id => id.toString() !== req.user.id);
        await chat.save();

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
        });
    } catch (error) {
        console.error('Error in unMute a chat', error);
        next(error);
    }

}

exports.deleteChat = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ _id: req.body.chatId, participants: req.user.id });

        if (!chat) {
            return res.status(500).json({
                header: { errorCode: '404', message: "Chat not found or unauthorized" }
            });
        }

        if (!chat.deletedBy.includes(req.user.id)) {
            chat.deletedBy.push(req.user.id);
            await chat.save();
        }

        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: 'Success',
            },
        });
    } catch (error) {
        console.error('Error in delete a chat', error);
        next(error);
    }

}

