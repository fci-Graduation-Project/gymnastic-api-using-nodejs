// const Router = require("express");
const express = require("express");

// const router = Router();

// const protectRoutes = require("../services/authService");

// const protectRoutes = require("../middleware/auth.middleware.js");
// const { allowTo } = require("../controller/auth.controller.js");
// const {
//   addLikeValidator,
//   createPostValidator,
//   deletedLikeValidator,
//   updatePostValidator,
// } = require("../utils/validators/post.validator.js");

const {
  addLike,
  createPost,
  deletePost,
  getAllLikes,
  getAllMyPosts,
  getAllPosts,
  getSpecificPost,
  removeLike,
  updatePost,
} = require("../services/postService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);
router.use(authService.allowedTo("admin", "manager", "user"));

router.post(
  "/add",
  authService.protect,
  authService.allowedTo("user"),
  createPost
);

router.patch("/update/:id", updatePost);

router.delete("/delete/:id", deletePost);

router.get("/all/following", getAllPosts);

router.get("/all/my-posts", getAllMyPosts);

router.get("/one/:id", getSpecificPost);

router.post("/:id/like", addLike);

router.delete("/:id/like", removeLike);

router.get("/:id/all-like", getAllLikes);

module.exports = router;
