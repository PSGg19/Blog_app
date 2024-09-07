const express = require('express');
const { verifyUser } = require('../utils/verifyUser');
const { create, getPosts, deletePosts, updatePost } = require('../controller/post.controller');

const router = express.Router();

// Route to create a new post
// This route is protected by the 'verifyUser' middleware to ensure the user is authenticated
router.post('/create', verifyUser, create);

// Route to get posts with optional category filter
// This route returns all posts if no category is provided, or posts filtered by category if provided
router.get('/getposts', async (req, res, next) => {
  try {
    const { category } = req.query;
    const posts = category
      ? await Post.find({ category })  // Fetch posts by category if the category query is provided
      : await Post.find();  // Fetch all posts if no category is specified
    res.status(200).json(posts);  // Return the posts as a JSON response
  } catch (error) {
    next(error);  // Pass the error to the error handling middleware
  }
});

// Route to delete a post
// This route requires the user to be authenticated (via 'verifyUser') and ensures the user can only delete their own posts
router.delete('/deletepost/:postId/:userId', verifyUser, deletePosts);

// Route to update a post
// This route allows the user to update their post. It is protected by the 'verifyUser' middleware
router.put('/updatepost/:postId/:userId', verifyUser, updatePost);

module.exports = router;
