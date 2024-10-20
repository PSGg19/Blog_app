
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
mongoose.connect(process.env.MONGODB_URL).then(()=>console.log('db connection successful'))
.catch((error)=>{
    console.log('db connection not successful');
    console.error(error);
    process.exit(1);
});

const app = express();

const __dirnames = path.resolve();

app.use(express.json());

app.use(cookieParser());

app.listen(3000,()=>{
    console.log('app is running at port 3000');
});

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);

app.use(express.static(path.join(__dirnames,'/client/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirnames,'client','dist','index.html'))
});


app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'internal server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message:message});
})