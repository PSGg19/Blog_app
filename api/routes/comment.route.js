const express = require('express');
const { createComment, getPostComments, likeComment, editComment, deleteComment, getComments } = require('../controller/comment.controller');
const { verifyUser } = require('../utils/verifyUser');

const router = express.Router();

// Route to create a new comment
// This route requires the user to be authenticated, verified by the 'verifyUser' middleware
router.post('/create', verifyUser, createComment);

// Route to get comments for a specific post
// The post ID is passed as a parameter in the URL
router.get('/getPostComments/:postId', getPostComments);

// Route to like a comment
// This route allows a verified user to like a specific comment by its ID
router.put('/likeComment/:commentId', verifyUser, likeComment);

// Route to edit an existing comment
// The user must be authenticated to edit the comment
// It checks if the user is the author of the comment or has admin privileges
router.put('/editComment/:commentId', verifyUser, editComment);

// Route to delete a comment
// This route allows a verified user to delete a specific comment by its ID
// It checks if the user is the author of the comment or has admin privileges
router.delete('/deleteComment/:commentId', verifyUser, deleteComment);

// Route to get all comments of a specific user
// Only authenticated users can view comments
router.get('/getcomments', verifyUser, getComments);

// Export the router so it can be used in other parts of the application
module.exports = router;
