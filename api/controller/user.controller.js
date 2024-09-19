const { errorHandler } = require("../utils/error");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

import bcrypt from 'bcryptjs';  // Ensure bcrypt is imported
import { errorHandler } from '../utils/error';  // Ensure errorHandler is imported

export const updateUser = async (req, res, next) => {
  // Check if the user is authorized to update (admin or the user themselves)
  if (req.user.id !== req.params.userId && !req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  // Extract values from the request body
  const { password, username, email, profilePicture } = req.body;

  // If password is provided, validate and hash it
  if (password) {
    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters long"));
    }
    req.body.password = bcrypt.hashSync(password, 10);
  }

  // Validate username if provided
  if (username) {
    // Check username length and spaces
    if (username.length < 7 || username.length > 20) {
      return next(errorHandler(400, "Username must be between 7 and 20 characters"));
    }
    if (/\s/.test(username)) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    // Ensure username is lowercase and contains only alphanumeric characters
    if (username !== username.toLowerCase()) {
      return next(errorHandler(400, "Username must be in lowercase"));
    }
    if (!/^[a-z0-9]+$/.test(username)) {
      return next(errorHandler(400, "Username must contain only lowercase letters and numbers"));
    }
  }

  try {
    // Perform the update operation
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: username || undefined,  // If not provided, don't update
          email: email || undefined,
          profilePicture: profilePicture || undefined,
          password: req.body.password || undefined, // Only set password if it's hashed
        },
      },
      { new: true }
    );

    // If no user found, return error
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Exclude the password field from the response
    const { password: pwd, ...rest } = updatedUser._doc;

    // Return the updated user data
    return res.status(200).json({
      message: "User updated successfully",
      user: rest,
    });
  } catch (error) {
    // Catch and handle any errors during the update operation
    return next(errorHandler(500, "Failed to update user"));
  }
};


exports.deleteUser = async (req, res, next) => {
  // Check if the user is not an admin and does not match the ID of the user to be deleted
  // If both conditions are true, return a 403 error as they are not allowed to delete the user
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }

  try {
    // Attempt to find and delete the user by their ID
    const userToDelete = await User.findByIdAndDelete(req.params.userId);

    // If no user is found, send a 404 error (optional)
    if (!userToDelete) {
      return next(errorHandler(404, "User not found"));
    }

    // Respond with a success message once the user is deleted
    res.status(200).json("User has been deleted");
  } catch (error) {
    // Catch any errors and pass them to the error handler
    next(error);
  }
};


exports.signout = (req, res, next) => {
  try {
    // Clear the 'access_token' cookie, effectively signing the user out
    res
      .clearCookie("access_token") // Remove the access token cookie
      .status(200) // Send a 200 OK status code
      .json("User has been signed out"); // Respond with a success message
    
  } catch (error) {
    // Catch any errors that occur and pass them to the next error handler
    next(error);
  }
};


exports.getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "you are not allowed to see all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limti) || 9;
    // const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const oneMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      oneMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

import { errorHandler } from '../utils/error'; // Ensure errorHandler is imported

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    
    // If user is not found, return an appropriate error
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Destructure to exclude sensitive data (password)
    const { password, ...rest } = user._doc;
    
    // Return the user data (without the password field)
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose'; // for ObjectId check if not already imported
import { errorHandler } from '../utils/error'; // Ensure errorHandler is imported

export const getUserProfile = async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    // Fetch user excluding sensitive fields (like password and __v)
    const user = await User.findById(userId).select("-password -__v");

    // If user is not found, return 404
    if (!user) {
      console.warn(`User with ID ${userId} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    // Log access for debugging purposes
    console.log(`User profile fetched for ID: ${userId}`);

    // Send response with user profile
    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });

  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    return next(errorHandler(500, "Internal Server Error while fetching user profile"));
  }
};
