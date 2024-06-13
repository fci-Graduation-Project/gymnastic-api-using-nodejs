const express = require("express");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewCoachValidator");

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setReviewerAndRevieweeIdToBody,
} = require("../services/reviewCoachService");

const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router.route("/").get(createFilterObj, getReviews).post(
  authService.protect,
  authService.allowedTo("user"),
  setReviewerAndRevieweeIdToBody, // Update the middleware name
  createReviewValidator,
  createReview
);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "coach", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
