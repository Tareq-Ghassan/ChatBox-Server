const express = require('express');
const router = express.Router();

const userController = require('../controller/authentication_controller');

const registerValidation = require('../validation/register_validation');
const loginValidation = require('../validation/login_validation');

const authenticateToken = require('../../middleware/is_authenticated');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized - Invalid credentials
 */
router.post('/login', loginValidation.validateLogin, userController.login);


/**
 * @swagger
 * /register:
 *   post:
 *     summary: User registration
 *     description: Registers a new user and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *               - countryCode
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *               countryCode:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict - Email or phone number already exists
 */
router.post('/register', registerValidation.validateRegister, userController.register);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user by blacklisting the JWT token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: No token provided
 *       401:
 *         description: Unauthorized - Token invalid
 * 
 */
router.post('/logout', authenticateToken, userController.logout);



module.exports = router;