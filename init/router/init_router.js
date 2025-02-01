const express = require('express')
const router = express.Router()

const initController = require('../controller/init_controller')
/**
 * @swagger
 * tags:
 *   name: Initialization
 *   description: API for server initialization and configuration retrieval.
 */

/**
 * @swagger
 * /serverInit:
 *   post:
 *     summary: Initialize server connection
 *     description: Validates appKey and appSecret to initialize the server connection.
 *     tags: [Initialization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appKey
 *               - appSecret
 *             properties:
 *               appKey:
 *                 type: string
 *                 description: Unique application key
 *               appSecret:
 *                 type: string
 *                 description: Secret key for authentication
 *     responses:
 *       200:
 *         description: Server initialized successfully
 *       400:
 *         description: Invalid request, missing appKey or appSecret
 *       401:
 *         description: Unauthorized - Invalid appKey or appSecret
 */
router.post('/serverInit', initController.init)

/**
 * @swagger
 * /getConfiguration:
 *   get:
 *     summary: Retrieve server configuration
 *     description: Fetches the configuration settings including country codes.
 *     tags: [Initialization]
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 header:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "00000"
 *                     message:
 *                       type: string
 *                       example: "Success"
 *                 body:
 *                   type: object
 *                   properties:
 *                     countryCodes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Configuration'
 *       500:
 *         description: Server error
 */
router.get('/getConfiguration', initController.getConfiguration)


module.exports = router