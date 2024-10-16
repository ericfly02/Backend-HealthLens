require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// CORS configuration
const corsOptions = {
    origin: 'https://www.healthlens.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.options('*', cors(corsOptions)); // Handle preflight requests for all routes

// Import Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/map');
//const speechToTextRoutes = require('./routes/speechToTextRoutes');

// Route handlers
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/user', userRoutes);
app.use('/map', mapRoutes);
//app.use('/speech', speechToTextRoutes);

// Export the app (remove app.listen)
module.exports = app;
