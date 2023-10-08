const Post = require("../model/post");
const Comment = require("../model/comment")
const bigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customError");
const filUpload = require("express-fileupload");
const cloudinary = require("cloudinary");;

exports.createPost = bigPromise(async (req, res, next) => {

  let result;
  if (req.files) {
    const file = req.files.photo;
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "posts",
      width: 150,
      crop: "scale",
    });
  }

  const { title, content } = req.body;
  const author = req.user; // Assuming you have user information in req.user after authentication

  try {

    let post;

    if (result) {
      post = await Post.create({
        title,
        content,
        author,
        photo: {
          id: result.public_id,
          secure_url: result.secure_url,
        }
      });
    } else {
      post = await Post.create({
        title,
        content,
        author,
      });
    }

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    if (result) {
      await cloudinary.v2.uploader.destroy(result.public_id);
    }
    return next(new CustomError(error.message, 400));
  }
});

exports.getAllPosts = bigPromise(async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author");

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

exports.getPostById = bigPromise(async (req, res, next) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId).populate("author");

    if (!post) {
      return next(new CustomError("Post not found", 404));
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

exports.deletePost = bigPromise(async (req, res, next) => {
  const postId = req.params.id;
  const loggedInUserId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return next(new CustomError("Post not found", 404));
    }

    // Check if the logged-in user is the owner of the post
    if (post.author.toString() !== loggedInUserId.toString()) {
      return next(new CustomError("You are not authorized to delete this post", 403));
    }

    // Find and delete all comments associated with the post
    await Comment.deleteMany({ postId: post._id });

    if (post.photo) {
      await cloudinary.v2.uploader.destroy(post.photo.id)
    }

    // Delete the post
    await post.deleteOne();

    res.json({
      message: "Post and associated comments deleted successfully"
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});



exports.getLoggedInUserPosts = bigPromise(async (req, res, next) => {
  try {
    // Assuming you have user information in req.user after authentication
    const userId = req.user._id;

    // Find posts with the logged-in user's ID as the author
    const userPosts = await Post.find({ author: userId });

    res.status(200).json({
      success: true,
      data: userPosts,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});




