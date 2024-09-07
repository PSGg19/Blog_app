const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const postRoutes = require('./routes/post.route');
const commentRoutes = require('./routes/comment.route');
const cookieParser = require('cookie-parser');
const path = require('path');

// Connect to MongoDB database using Mongo Atlas connection string.
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('DB connection successful'))
  .catch((error) => {
    console.log('DB connection not successful');
    console.error(error);
    process.exit(1); // Exit the process in case of database connection failure
  });

const app = express();

// Get the absolute path of the current directory
const __dirnames = path.resolve();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// API Routes for various entities
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Serve static files from the client build folder
app.use(express.static(path.join(__dirnames, '/client/dist')));

// Handle all other routes, return the index.html of the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnames, 'client', 'dist', 'index.html'));
});

// Global error handler for centralized error management
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    error: {
      message: message,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack // Avoid stack trace in production
    }
  });
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('App is running on port 3000');
});
