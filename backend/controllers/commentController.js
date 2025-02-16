const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");

exports.comment = async (req, res) => {
  try {
    const { postId, userId, comment } = req.body;
    const newComment = new commentModel({
      postId,
      userId,
      comment,
    });

    await newComment.save();
    const existingPost = await postModel.findById(postId);

    if (!existingPost) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }
    existingPost.comment.push(newComment._id);

    await existingPost.save();

    return res.status(201).json({
      success: true,
      message: "Comment created",
      comment: newComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error during comment creation",
      error,
    });
  }
};
