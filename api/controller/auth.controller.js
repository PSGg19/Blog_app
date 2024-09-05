const User = require("../models/User.model");
const bcrypt = require('bcrypt');
const {errorHandler}  = require('../utils/error.js');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if all required fields are provided
  if (
    !username ||
    !email ||
    !password ||
    username.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    // If any field is missing, return an error
    return next(errorHandler(400, 'Please fill all the fields.'));
  }

  // Validate that the username contains only letters, numbers, and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return next(errorHandler(400, 'Username can only contain letters, numbers, and underscores.'));
  }

  // Validate email format using regular expression
  if (!/\S+@\S+\.\S+/.test(email)) {
    return next(errorHandler(400, 'Please provide a valid email address.'));
  }

  // Ensure password is at least 8 characters long
  if (password.length < 8) {
    return next(errorHandler(400, 'Password must be at least 8 characters long.'));
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If the email is already in use, return an error
      return next(errorHandler(400, 'Email is already registered.'));
    }

    // Hash the password before saving it to the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user with the provided details
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send a successful response after the user is created
    res.status(201).json({
      message: "Signup successful, welcome to the platform!",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'Please fill all the fields.'));
  }

  try {
    // Find the user with the given email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found.'));
    }

    // Compare the provided password with the stored hashed password
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password.'));
    }

    // Generate a JWT token with user id and admin status
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    // Exclude the password from the response
    const { password: pass, ...rest } = validUser._doc;

    // Send the token in the cookie and user details in the response
    res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);

  } catch (error) {
    // Handle any errors during the process
    next(error);
  }
};


exports.googleAuth = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    // Check if the user already exists by email
    const user = await User.findOne({ email });

    if (user) {
      // If user already exists, generate a new JWT token for the session
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );

      // Exclude the password field from the user data before sending it
      const { password, ...rest } = user._doc;

      // Send the token in the cookie and user data in the response
      res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    } else {
      // If the user doesn't exist, create a new user
      // Generate a random password to save for new user (not to be used for login)
      const generatedPassword =
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      // Hash the generated password
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      // Create a new user with Google account details
      const newUser = await User.create({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-3), // Generate a unique username
        email,
        password: hashedPassword, // Save the hashed password
        profilePicture: googlePhotoUrl, // Save Google profile picture URL
      });

      // Save the newly created user to the database
      await newUser.save();

      // Generate a JWT token for the new user
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      // Exclude the password field from the response data
      const { password, ...rest } = newUser._doc;

      // Send the token in the cookie and user data in the response
      res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    }
  } catch (error) {
    // Catch any errors and pass them to the next error handler
    next(error);
  }
};






