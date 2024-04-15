const express = require("express");

// const {
//   createRepostValidator,
//   updateRepostValidator,
//   addLikeToRepostValidator,
//   removeLikeFromRepostValidator,
// } = require("../utils/validators/repostValidator");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);
router.use(authService.allowedTo("admin", "manager", "user"));

const {
  createRepost,
  deleteRepost,
  getSpecificRepost,
  updateRepost,
  addLikeToRepost,
  removeLikeFromRepost,
  getAllLikesFromRepost,
} = require("../services/repostService");

router.post(
  "/add",

  // createRepostValidator,
  createRepost
);

router.get(
  "/one/:id",

  // updateRepostValidator,
  getSpecificRepost
);

router.patch(
  "/update/:id",

  // updateRepostValidator,
  updateRepost
);

router.delete(
  "/delete/:id",

  // updateRepostValidator,
  deleteRepost
);

router.post(
  "/:id/like",

  // addLikeToRepostValidator,
  addLikeToRepost
);

router.delete(
  "/:id/like",

  // removeLikeFromRepostValidator,
  removeLikeFromRepost
);

router.get(
  "/:id/all-like",

  getAllLikesFromRepost
);
module.exports = router;
