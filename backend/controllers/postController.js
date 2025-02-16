const postModel = require("../models/postModel");

exports.createPost = async (req, res) => {
  try {
    const { Title, dsc } = req.body;

    if (!Title) {
      return res.status(400).json({
        success: false,
        message: "At least Title is required",
      });
    }
    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = await new postModel({
      Title,
      dsc,
      image: imgPath,
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "New post created",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error during creating post",
      error,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await postModel.find().populate("comment");

    if (!post) {
      return res.status(409).json({
        success: false,
        message: "Post Not Found",
      });
    }

    return res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during retrieving post",
      error,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { Title, dsc } = req.body;
    const postId = req.params.id;

    const findPost = await postModel.findById(postId);
    if (!findPost) {
      return res.status(404).send({
        message: "Post not found",
        success: false,
      });
    }
    if (Title) {
      findPost.Title = Title;
    }
    if (dsc) {
      findPost.dsc = dsc;
    }
    if (req.file) {
      findPost.image = req.file.filename;
    }
    await findPost.save();
    res.status(200).send({
      message: "Post updated successfully",
      success: true,
      post: findPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while updating post",
      success: false,
      error,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletePost = await postModel.findByIdAndDelete(postId);
    if (!deletePost) {
      return res.status(409).json({
        success: false,
        message: "Post Not Fouund",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Post Deleted",
      deletePost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error during deleting post",
      error,
    });
  }
};
