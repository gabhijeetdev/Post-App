const bigPromise = require('../middleware/bigPromise');
const Like = require('../model/like');

// Controller for toggling like/unlike on a post
exports.toggleLike = bigPromise(async (req, res) => {
  const postId = req.params.postid; // Get the postid from req.params
  const userId = req.user._id; // Get the user ID from req.user

  try {
    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ userId, itemId: postId });

    if (existingLike) {
      // User has already liked the post, so unlike it
      await Like.deleteOne({ userId, itemId: postId });
      res.json({ message: 'Post unliked successfully' });
    } else {
      // User has not liked the post, so like it
      const newLike = new Like({ userId, itemId: postId });
      await newLike.save();
      res.status(201).json({ message: 'Post liked successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to toggle like/unlike on post' });
  }
});

exports.getLikeCountForPost = bigPromise(async (req, res) => {
    const postId = req.params.postid; // Get the postid from req.params
  
    try {
      // Count the number of likes associated with the specific post
      const likeCount = await Like.countDocuments({ itemId: postId });
  
      res.json({ likeCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch like count for the post' });
    }
  });
