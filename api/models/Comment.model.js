const mongoose = require("mongoose");

const CommentModel = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId, // Use ObjectId to link the comment to a post
      ref: "Post", // Reference to Post model
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId, // Use ObjectId to link the comment to a user
      ref: "User", // Reference to User model
      required: true,
    },
    likes: {
      type: [mongoose.Types.ObjectId], // Array of user ObjectIds who liked the comment
      default: [],
      ref: "User", // Reference to User model for the likes
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentModel);

module.exports = Comment;
