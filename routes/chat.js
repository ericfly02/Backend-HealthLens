const express = require('express');
const router = express.Router();
const { startConversation } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for initiating Watson conversation after image analysis
router.post('/start-conversation', startConversation);

module.exports = router;
