const express = require('express');
const router = express.Router();
const {toggleLike,getLikeCountForPost} = require("../controller/likeController"); 
const { isLoggedIn } = require('../middleware/user');


// Endpoint to like an item
router.route("/:postid").get(isLoggedIn,toggleLike)
router.route("/:postid/likeCount").get(getLikeCountForPost)

module.exports = router;
