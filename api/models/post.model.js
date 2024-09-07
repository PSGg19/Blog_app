const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId, // Use ObjectId to reference the User model
    ref: 'User', // Reference to User model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true, // Ensure titles are unique
  },
  image: {
    type: String,
    default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
  },
  category: {
    type: String,
    default: 'uncategorized',
    index: true, // Index for faster search by category
  },
  slug: {
    type: String,
    required: true,
    unique: true, // Ensure slugs are unique
  },
}, { timestamps: true });

// Optional: Add index for better performance on frequently queried fields
postSchema.index({ category: 1 });
postSchema.index({ slug: 1 });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
