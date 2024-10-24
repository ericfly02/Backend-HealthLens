const express = require('express');
const router = express.Router();
const { startConversation } = require('../controllers/chatController');

// Middleware to handle preflight requests
router.options('/start-conversation', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://www.healthlens.app');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200); // Send OK status for preflight
});

// Route for initiating Watson conversation
router.post('/start-conversation', startConversation);

module.exports = router;
