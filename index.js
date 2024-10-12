require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// CORS configuration
const corsOptions = {
    origin: 'https://www.healthlens.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add 'OPTIONS'
    allowedHeaders: ['Content-Type', 'Authorization'], // Add allowed headers
    credentials: true
};


// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.options('*', cors(corsOptions)); // Handle preflight requests for all routes
    
// Import Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/map');
//const speechToTextRoutes = require('./routes/speechToTextRoutes');

// Initialize Express app
const app = express();

// Route handlers
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/user', userRoutes);
app.use('/map', mapRoutes);
//app.use('/speech', speechToTextRoutes);

// Export the app (remove app.listen)
module.exports = app;
