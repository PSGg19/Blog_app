const express = require('express');
const {verifyUser} = require('../utils/verifyUser');
const {create,getPosts,deletePosts,updatePost} = require('../controller/post.controller');

const router = express.Router();

router.post('/create',verifyUser,create);
router.get('/getposts',getPosts);
router.delete('/deletepost/:postId/:userId',verifyUser,deletePosts);
router.put('/updatepost/:postId/:userId', verifyUser, updatePost)
const { category } = req.query;
const posts = category
  ? await Post.find({ category })
  : await Post.find();


module.exports = router;