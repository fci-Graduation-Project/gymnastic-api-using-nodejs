const factory = require("./handlersFactory");
const ReviewCoach = require("../models/reviewCoachModel");

// Nested route
// GET /api/v1/users/:userId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.userId) filterObject = { reviewee: req.params.userId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(ReviewCoach);

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(ReviewCoach);

// Nested route (Create)
exports.setReviewerAndRevieweeIdToBody = (req, res, next) => {
  if (!req.body.reviewer) req.body.reviewer = req.user._id;
  if (!req.body.reviewee) req.body.reviewee = req.params.userId;
  next();
};

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private/Protect/User
exports.createReview = factory.createOne(ReviewCoach);

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
exports.updateReview = factory.updateOne(ReviewCoach);

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(ReviewCoach);
