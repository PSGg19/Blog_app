
const express = require('express');
const router = express.Router();

const {signup,signin,googleAuth} = require('../controller/auth.controller');
 
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',googleAuth);

module.exports = router;