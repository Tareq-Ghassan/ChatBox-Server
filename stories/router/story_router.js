const express = require('express');
const router = express.Router();
const storyController = require('../controller/story_controller');
const storyValidation = require('../validation/story_validation');
const authenticateToken = require('../../middleware/is_authenticated');


router.get('/fetch', authenticateToken, storyController.getStories);


router.post('/create', authenticateToken, storyValidation.validateCreateStory, storyController.createStory);

module.exports = router;
