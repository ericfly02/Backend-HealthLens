require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/map');
//const speechToTextRoutes = require('./routes/speechToTextRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route handlers
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/user', userRoutes);
app.use('/map', mapRoutes);
//app.use('/speech', speechToTextRoutes);

// Export the app (remove app.listen)
module.exports = app;
