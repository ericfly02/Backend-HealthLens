const express = require('express');
const multer = require('multer');
const { processAudio } = require('../controllers/speechToTextController');
const router = express.Router();

// Use Multer for handling multipart/form-data (file uploads)
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });

// POST route for audio transcription
router.post('/transcribe', upload.single('audio'), processAudio);

module.exports = router;
