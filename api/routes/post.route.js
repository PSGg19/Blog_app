const express = require('express');
const {verifyUser} = require('../utils/verifyUser');
const {create,getPosts,deletePosts,updatePost} = require('../controller/post.controller');

const router = express.Router();

router.post('/create',verifyUser,create);
router.get('/getposts',getPosts);
router.delete('/deletepost/:postId/:userId',verifyUser,deletePosts);
router.put('/updatepost/:postId/:userId', verifyUser, updatePost)


module.exports = router;