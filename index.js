require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// CORS configuration
const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true
};


// Initialize Express app
const app = express();

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Handle preflight `OPTIONS` requests globally
app.options('*', cors(corsOptions)); 

// Import Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/map');

// Route handlers
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/user', userRoutes);
app.use('/map', mapRoutes);

// Error handling for CORS issues
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://www.healthlens.app");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Export the app
module.exports = app;
