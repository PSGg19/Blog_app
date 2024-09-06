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


exports.getPostComments=async(req,res,next)=>{
  try{
    const comments = await Comment.find({postId:req.params.postId}).sort({createdAt:-1,
    });
     res.status(200).json(comments);
  }catch(error){
    next(error);

  }


}

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
    // Find the comment by its ID from the database
    const comment = await Comment.findById(req.params.commentId);

    // If the comment does not exist, return a 404 error
    if (!comment) {
      return next(errorHandler(404, 'No comment with that Id exists'));
    }

    // Check if the user is either the owner of the comment or an admin
    // If the user is not the comment's owner or an admin, return a 403 error
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this comment'));
    }

    // If the user has the right permissions, delete the comment
    await Comment.findByIdAndDelete(req.params.commentId);

    // Send a success message with status 200 after deleting the comment
    res.status(200).json('Comment has been deleted');
    
  } catch (error) {
    // Catch any errors and pass them to the next error handler
    next(error);
  }
};

exports.getComments=async(req,res,next)=>{
 
    if(!req.user.isAdmin){
      return next(errorHandler(403,'you are not allowed to get all comments'))
    }
    try{
     const startIndex = parseInt(req.query.startIndex) || 0;
     const limit = req.query.limit || 9;
     const sortDirection = req.query.sort === 'desc' ? -1 : 1;
     const comments = await  Comment.find()
     .sort({createdAt:sortDirection})
     .skip(startIndex)
     .limit(limit);
     const totalComments = await Comment.countDocuments();
     const now = new Date();
     const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
     const lastMonthComments = await Comment.countDocuments({createdAt:{ $gte:oneMonthAgo}});
     res.status(200).json({comments,totalComments,lastMonthComments});
  }catch(error){


  }


}
