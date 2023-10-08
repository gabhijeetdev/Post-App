const bigPromise = require('../middleware/bigPromise');
const Comment = require('../model/comment');
const Post = require('../model/post'); // Import your Post model

// Controller to add a comment to a post
exports.addComment = bigPromise(async (req, res,next) => {
  const { content } = req.body;
  const userId = req.user._id; // Get the user ID from req.user
  const postId = req.params.postid;

  try {
    // Check if the post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create a new comment and associate it with the post
    const newComment = new Comment({ userId, postId, content });
    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to add a comment to the post' });
  }
});

// Controller to get all comments for a specific post
exports.getCommentsForPost = bigPromise(async (req, res,next) => {

  const postId = req.params.postid; // Get the postid from req.params

  try {
    // Find all comments associated with the specific post
    const commentsForPost = await Comment.find({ postId }).populate('userId'); // Populate the author field with the username

    res.json({ comments: commentsForPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch comments for the post' });
  }
});

exports.deleteComment = bigPromise(async (req, res) => {
  const commentId = req.params.commentid; // Get the commentid from req.params
  const userId = req.user._id; // Get the user ID from req.user

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the user making the request is the author of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    // Delete the comment
    // await Comment.findByIdAndDelete(commentId);
    await comment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete the comment' });
  }
});
