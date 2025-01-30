const express = require('express');

const router = express.Router();
const userController = require('../controller/user_controller');
const registerValidation = require('../validation/register_validation');
const authenticateToken = require('../../middleware/is_authenticated');


router.post('/login', userController.login);

router.post('/register', registerValidation.validateRegister, userController.register);

router.post('/logout', authenticateToken, userController.logout);



module.exports = router;