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

// CORS configuration
const corsOptions = {
    origin: 'https://www.healthlens.app', // Allow requests only from your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow cookies and other credentials
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Route handlers
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/user', userRoutes);
app.use('/map', mapRoutes);
//app.use('/speech', speechToTextRoutes);

// Export the app (remove app.listen)
module.exports = app;
