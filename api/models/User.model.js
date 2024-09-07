const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Automatically trims whitespace around username
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Automatically converts email to lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Basic email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Enforce minimum length for password
  },
  profilePicture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// Optional: Index for quick lookup of users by email and username
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
