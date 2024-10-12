const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, chat);

module.exports = router;
