const express = require("express");

// const {
//   createCommentValidator,
//   getAllCommentsValidator,
//   updateCommentValidator
// } = require("../utils/validators/userValidator");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);
router.use(authService.allowedTo("admin", "coach", "user"));

const {
  createComment,
  deleteComment,
  getAllComments,
  getSpecificComment,
  updateComment,
} = require("../services/commentService.js");
router.post(
  "/add",

  // createCommentValidator,
  createComment
);

router.get(
  "/all",

  // getAllCommentsValidator,
  getAllComments
);

router.get(
  "/one/:id",

  // updateCommentValidator,
  getSpecificComment
);

router.patch(
  "/update/:id",

  // updateCommentValidator,
  updateComment
);

router.delete(
  "/delete/:id",

  // updateCommentValidator,
  deleteComment
);

module.exports = router;
