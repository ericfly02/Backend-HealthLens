// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have a JWT middleware
const { sendEmailReport } = require('../controllers/sendEmailReportController');

// Route to get user info
router.get('/me', authMiddleware, userController.getUserInfo);

// Route to update user info
router.patch('/update', authMiddleware, userController.updateUser);

router.post('/email-report', authMiddleware, sendEmailReport);

module.exports = router;
