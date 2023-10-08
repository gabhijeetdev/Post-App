const express = require('express');
const router = express.Router();
const { addComment, getCommentsForPost,deleteComment } = require('../controller/commentController'); // Import your comment controller
const { isLoggedIn } = require('../middleware/user'); // Import your authentication middleware

// Endpoint to add a comment to a post
router.route("/:postid/comment").post(isLoggedIn, addComment);

// Endpoint to get comments for a specific post
router.route("/:postid/comments").get(getCommentsForPost);

// router.route("/:commentid").delete(isLoggedIn,deleteComment);

router.route("/:commentid").delete(isLoggedIn,deleteComment)

module.exports = router;
