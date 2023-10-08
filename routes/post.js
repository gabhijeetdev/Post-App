const express = require("express");
const router = express.Router();

const {
    createPost,
    getAllPosts,
    getPostById,
    deletePost,
    getLoggedInUserPosts,
} = require("../controller/postController");

const { isLoggedIn } = require("../middleware/user");

// Create a new post
router.route("/").post(isLoggedIn, createPost);

// Get all posts
router.route("/").get(getAllPosts);

router.route("/myPosts").get(isLoggedIn,getLoggedInUserPosts)

// Get a single post by ID
router.route("/:id").get(getPostById);

// Delete a post by ID
router.route("/:id").delete(isLoggedIn, deletePost);

module.exports = router;
