const express = require('express');
const router = express.Router();

// Importing the controller functions for signup, signin, and google authentication
const { signup, signin, googleAuth } = require('../controller/auth.controller');

// POST route for user signup
// This route handles the registration of a new user
// It expects data like username, email, and password in the request body
router.post('/signup', signup);

// POST route for user signin
// This route handles user login, where users provide their credentials (email and password)
// It returns an authentication token on successful login
router.post('/signin', signin);

// POST route for Google Authentication
// This route allows users to authenticate via Google
// It expects user details like name, email, and profile picture URL from Google
router.post('/google', googleAuth);

// Export the router so it can be used in other parts of the application
module.exports = router;
