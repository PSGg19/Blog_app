const { errorHandler } = require("../utils/error");
const Comment = require("../models/Comment.model");

// Create a new comment
exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    // Validate required fields
    if (!content || !postId || !userId) {
      return next(errorHandler(400, "Content, postId, and userId are required"));
    }

    // Ensure the user creating the comment is the logged-in user
    if (userId !== req.user.id) {
      return next(errorHandler(403, "you are not allowed to create this comment"));
    }

    // Create and save the new comment
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    // Return the created comment
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

// Get all comments for a specific post
exports.getPostComments = async (req, res, next) => {
  try {
    // Find comments with the given postId and sort them by newest first
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Like or unlike a comment
exports.likeComment = async (req, res, next) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return nexr(errorHandler(404, "comment not found")); // Typo: should be "next"
    }

    // Check if user already liked the comment
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      // Like the comment
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      // Unlike the comment
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// Edit a comment
exports.editComment = async (req, res, next) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findByIdAndUpdate(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'comment not found'));
    }

    // Only owner or admin can edit
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      console.log(comment.userId, req.user.id, req.user.isAdmin);
      return next(errorHandler(403, 'you are not allowed to edit this comment'));
    }

    // Update the comment content
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }, // Return updated document
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

// Delete a comment
exports.deleteComment = async (req, res, next) => {
  try {
    // Find comment by ID
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'No comment with that Id exists'));
    }

    // Only owner or admin can delete
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'you are not allowed to delete this comment'));
    }

    // Delete the comment
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('comment has been deleted');
  } catch (error) {
    next(error);
  }
};

// Get all comments (admin only)
exports.getComments = async (req, res, next) => {
  // Only admin allowed
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'you are not allowed to get all comments'));
  }

  try {
    // Pagination and sorting
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = req.query.limit || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;

    // Fetch comments with pagination
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Count total comments
    const totalComments = await Comment.countDocuments();

    // Count comments from last 1 month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    // Return data
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error); // This was missing earlier
  }
};
