const express = require('express');
const router = express.Router();

const chatController = require('../controller/chat_controller')
const messageController = require('../controller/message_controller')

const authenticateToken = require('../../middleware/is_authenticated');

const chatValidation = require('../validation/chat_validation')
/**
 * @swagger
 * tags:
 *  name: Chats
 *  description: Chat Management API
*/

/**
 * @swagger
 * /chat/chats:
 *   get:
 *     summary: Fetch all user chats (paginated)
 *     description: Retrieves a paginated list of the user's chats.
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default = 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of chats per page (default = 20)
 *     responses:
 *       200:
 *         description: Successfully fetched chats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalChats:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 chats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Chat ID
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: User IDs
 *                       lastMessage:
 *                         type: string
 *                         description: Last message ID
 *       401:
 *         description: Unauthorized - User not authenticated
 */
router.get('/chats',
    authenticateToken,
    chatValidation.checkIfIndexAndPerPageExist,
    chatController.getAllChats,
);

/**
 * @swagger
 * /chat/chat:
 *   get:
 *     summary: Fetch a specific chat
 *     description: Retrieves details of a chat by chat ID.
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat to fetch.
 *     responses:
 *       200:
 *         description: Successfully retrieved chat.
 *       400:
 *         description: Bad request (missing or invalid chat ID)
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Chat not found or user not a participant
 */
router.get('/chat',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatController.getChat,
);

/**
 * @swagger
 * /chat/archive:
 *   put:
 *     summary: Archive a chat
 *     description: Marks a chat as archived for the user.
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat to archive.
 *     responses:
 *       200:
 *         description: Chat archived successfully.
 */
router.put('/archive',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatController.archive,
);

/**
 * @swagger
 * /chat/unarchive:
 *   put:
 *     summary: Unarchive a chat
 *     description: Removes a chat from archived list for the user.
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat to unarchive.
 *     responses:
 *       200:
 *         description: Chat un archived successfully.
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Chat not found
 */
router.put('/unarchive',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatController.unarchive,
);

/**
 * @swagger
 * /chat/mute:
 *   put:
 *     summary: Mute a chat
 *     description: Mutes notifications for a chat.
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat to mute.
 *     responses:
 *       200:
 *         description: Chat muted successfully.
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Chat not found
 */
router.put('/mute',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatController.mute,
);

/**
 * @swagger
 * /chat/unmute:
 *   put:
 *     summary: Unmute a chat
 *     description: Un mutes notifications for a chat.
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat to unmute.
 *     responses:
 *       200:
 *         description: Chat unmuted successfully.
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Chat not found
 */
router.put('/unmute',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatController.unMute,
);

/**
 * @swagger
 * /chat/chat:
 *   delete:
 *     summary: Delete a chat
 *     description: Marks a chat as deleted for the user. If all participants delete it, the chat is permanently removed.
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat to delete.
 *     responses:
 *       200:
 *         description: Chat deleted successfully.
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Chat not found
 */
router.delete('/chat',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatController.deleteChat,
);


/**
 * @swagger
 * /chat/messages:
 *   get:
 *     summary: Fetch messages of a chat (paginated)
 *     description: Retrieves paginated messages for a chat.
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat to fetch messages from.
 *               page:
 *                 type: integer
 *                 description: Page number (default = 1)
 *               limit:
 *                 type: integer
 *                 description: Number of messages per page (default = 20)
 *     responses:
 *       200:
 *         description: Messages fetched successfully.
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Chat not found
 */
router.get('/messages',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatValidation.checkIfChatIdCorrect,
    chatValidation.checkIfIndexAndPerPageExist,
    messageController.getMessages,
);

/**
 * @swagger
 * /chat/sendMessage:
 *   post:
 *     summary: Send a message
 *     description: Sends a new message in a chat.
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat to send the message to.
 *               messageType:
 *                 type: string
 *                 enum: ["text", "image", "video", "audio", "document", "sticker", "voiceNote", "location"]
 *                 description: Type of message.
 *               content:
 *                 type: string
 *                 description: The text content of the message (if messageType is "text").
 *               mediaUrl:
 *                 type: string
 *                 description: URL of the media file (if messageType is "image", "video", etc.).
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                 description: Location data (if messageType is "location").
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *       400:
 *         description: Bad request (invalid input).
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       404:
 *         description: Chat not found.
 */
router.post('/sendMessage',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatValidation.checkIfChatIdCorrect,
    chatValidation.sendMessageRequest,
    messageController.sendMessage,
);


/**
 * @swagger
 * /chat/editMessage:
 *   put:
 *     summary: Edit a message
 *     description: Allows the sender to edit a message.
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId:
 *                 type: string
 *                 description: ID of the message to edit.
 *               newContent:
 *                 type: string
 *                 description: New content of the message.
 *     responses:
 *       200:
 *         description: Message edited successfully.
 *       400:
 *         description: Bad request (invalid input).
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - User is not the sender of the message.
 *       404:
 *         description: Message not found.
 */
router.put('/editMessage',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatValidation.checkIfChatIdCorrect,
    chatValidation.editMessageRequest,
    messageController.editMessage,
);

/**
 * @swagger
 * /chat/message:
 *   delete:
 *     summary: Delete a message
 *     description: Allows the sender to delete a message (soft delete).
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId:
 *                 type: string
 *                 description: ID of the message to delete.
 *     responses:
 *       200:
 *         description: Message deleted successfully.
 *       400:
 *         description: Bad request (invalid input).
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - User is not the sender of the message.
 *       404:
 *         description: Message not found.
 */
router.delete('/message',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatValidation.checkIfChatIdCorrect,
    messageController.deleteMessage,

);


/**
 * @swagger
 * /chat/seen:
 *   put:
 *     summary: Mark message as seen
 *     description: Marks a message as seen by the user.
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId:
 *                 type: string
 *                 description: ID of the message to mark as seen.
 *     responses:
 *       200:
 *         description: Message marked as seen.
 *       400:
 *         description: Bad request (invalid input).
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       404:
 *         description: Message not found.
 */
router.put('/seen',
    authenticateToken,
    chatValidation.checkIfChatIdExist,
    chatValidation.checkIfChatIdCorrect,
    messageController.markMessageAsSeen
);



module.exports = router;

