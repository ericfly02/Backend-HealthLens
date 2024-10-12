const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadImage } = require('../controllers/imageController');
const authMiddleware = require('../middlewares/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post('/', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;
