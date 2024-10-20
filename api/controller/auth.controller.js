const User = require("../models/User.model");
const bcrypt = require('bcrypt');
const {errorHandler}  = require('../utils/error.js');
const jwt = require('jsonwebtoken');

exports.signup = async (req,res,next) => {
  // console.log(req.body);
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400,'please fill all the fields'));
  }
  
  const hashedPassword =  bcrypt.hashSync(password,10);

  const newUser = new User({ 
    username, 
    email, 
    password : hashedPassword,
  });

  try {
    await newUser.save();
    res.json({
      message: "signup successful",
    });
  } catch (error) {
   next(error);
  }
};

exports.signin=async(req,res,next)=>{

  const{email,password} = req.body;
  if(!email || !password || email===''|| password==='') {
    return next(errorHandler(400,'please fill all the fields'));
  }
  try{
    const validUser = await User.findOne({email});
    if(!validUser){
      return next(errorHandler(404,' User not found'));
    }

    const validPassword = bcrypt.compareSync(password,validUser.password);
    if(!validPassword){
      return next(errorHandler(400,'Invalid Password'));
    }
    const token =jwt.sign( {id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET,);
    const {password:pass,...rest} = validUser._doc;
    res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest);

  }catch(error){
    next(error);
  }

}

exports.googleAuth = async(req,res,next)=>{
  const {name,email,googlePhotoUrl} = req.body;
  try{
  const user = await User.findOne({email});
  if(user){
    const token = jwt.sign({id:user._id, isAdmin:user.isAdmin},process.env.JWT_SECRET);
    const{password,...rest} = user._doc;
    res.status(200).cookie("access_token",token ,{ httpOnly:true}).json(rest);
  }
  else{
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(generatedPassword,10);
    const newUser = await User.create({
      username:name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-3),
      email,
      password:hashedPassword,
      profilePicture:googlePhotoUrl,
    });
  await newUser.save();
  const token = jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JET_SECRET);
  const{password,...rest} = newUser._doc;
  res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest);

  }

  }catch(error){
    next(error);

  }
}





