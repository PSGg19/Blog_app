exports.create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create the post"));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide both title and content"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error.message);
    next(errorHandler(500, "Failed to create the post"));
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    let queryConditions = {};

    if (req.query.userId) {
      queryConditions.userId = req.query.userId;
    }
    if (req.query.category) {
      queryConditions.category = req.query.category;
    }
    if (req.query.slug) {
      queryConditions.slug = req.query.slug;
    }
    if (req.query.postId) {
      queryConditions._id = req.query.postId;
    }
    if (req.query.searchTerm) {
      queryConditions.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const posts = await Post.find(queryConditions)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPost = await Post.countDocuments(queryConditions); // Count with query conditions

    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPost,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePosts = async (req, res, next) => {
  try {
    const isAuthorized = req.user.isAdmin || req.user.id === req.params.userId;
    if (!isAuthorized) {
      return next(errorHandler(403, "You are not allowed to delete this post"));
    }

    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    console.log(`Post ${req.params.postId} deleted by user ${req.user.id}`);

    return res.status(200).json("The post has been deleted");
  } catch (error) {
    console.error("Error in deletePosts:", error.message);
    next(errorHandler(500, "Internal Server Error"));
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    const isAuthorized = req.user.id === userId || req.user.isAdmin;
    if (!isAuthorized) {
      return next(errorHandler(403, "You are not authorized to update this post"));
    }

    const fieldsToUpdate = {};
    const allowedFields = ["title", "content", "category", "image"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    if (Object.keys(fieldsToUpdate).length === 0) {
      return next(errorHandler(400, "No valid fields provided to update"));
    }

    if (req.body.title) {
      fieldsToUpdate.slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return next(errorHandler(500, "Post update failed"));
    }

    console.log(`Post ${postId} updated by user ${req.user.id}`);

    return res.status(200).json({
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.error("Error in updatePost:", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
};
