const express = require('express');
const router = express.Router();
const { startConversation } = require('../controllers/chatController');

// Route for initiating Watson conversation
router.post('/start-conversation', startConversation);

module.exports = router;
