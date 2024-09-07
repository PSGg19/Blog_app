const express = require('express');
const router = express.Router();
const { updateUser, deleteUser, signout, getUsers, getUser, getUserProfile } = require('../controller/user.controller');
const { verifyUser } = require('../utils/verifyUser');

// Route to update a user's information
// This route is protected by the 'verifyUser' middleware to ensure only authenticated users can update their information
router.put('/update/:userId', verifyUser, updateUser);

// Route to delete a user
// This route is also protected by 'verifyUser', ensuring only authenticated users can delete their account
router.delete('/delete/:userId', verifyUser, deleteUser);

// Route to sign out a user
// Clears the authentication cookie (access token) and effectively signs out the user
router.post('/signout', signout);

// Route to get all users
// This route is protected by 'verifyUser' to ensure only authenticated users can access the list of users
router.get('/getusers', verifyUser, getUsers);

// Route to get a specific user's information by userId
// This route does not require authentication, allowing public access to user profiles
router.get('/:userId', getUser);

// Route to get a user's profile based on their user ID
// This is a profile-specific route for fetching user profile details
router.get('/:id/profile', getUserProfile);

module.exports = router;
