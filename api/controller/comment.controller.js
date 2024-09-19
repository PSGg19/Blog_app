const { errorHandler } = require("../utils/error");
const Comment = require("../models/Comment.model");



exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (!content?.trim() || !postId || !userId) {
      return next(errorHandler(400, "Content, postId, and userId are required"));
    }

    if (userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create this comment"));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found for commenting"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const newComment = new Comment({
      content: content.trim(),
      postId,
      userId,
      createdAt: new Date(),
    });

    const savedComment = await newComment.save();

    res.status(201).json({
      message: "Comment created successfully",
      comment: savedComment,
    });

  } catch (error) {
    next(errorHandler(500, "Failed to create comment"));
  }
};

exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next(errorHandler(500, "Failed to retrieve comments"));
  }
};

exports.likeComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    if (!commentId) {
      return next(errorHandler(400, "Comment ID is required"));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (!comment.likes) {
      comment.likes = [];
    }

    if (typeof comment.numberOfLikes !== "number") {
      comment.numberOfLikes = 0;
    }

    const userId = req.user.id;
    const userIndex = comment.likes.indexOf(userId);

    if (userIndex === -1) {
      comment.likes.push(userId);
      comment.numberOfLikes += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numberOfLikes = Math.max(comment.numberOfLikes - 1, 0);
    }

    const updatedComment = await comment.save();

    res.status(200).json({
      message: userIndex === -1 ? "Comment liked" : "Comment unliked",
      comment: updatedComment,
    });
  } catch (error) {
    next(errorHandler(500, "Error while liking/unliking comment"));
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const content = req.body.content?.trim();

    if (!commentId || !content) {
      return next(errorHandler(400, "Comment ID and new content are required"));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to edit this comment"));
    }

    comment.content = content;
    comment.editedAt = new Date();

    const updatedComment = await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    next(errorHandler(500, "Error while editing comment"));
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, 'No comment with that Id exists'));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this comment'));
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json('Comment has been deleted');
    
  } catch (error) {
    next(errorHandler(500, 'Error deleting comment'));
  }
};

exports.getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to retrieve comments'));
  }
};
