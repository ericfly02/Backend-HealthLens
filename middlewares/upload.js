const multer = require('multer');

// Set up multer in-memory storage
const storage = multer.memoryStorage();

// Create a multer instance with the in-memory storage
const upload = multer({ storage: storage });

module.exports = upload;
