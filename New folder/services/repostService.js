const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Comment = require("../models/commentModel");
const Repost = require("../models/repostModel");
// const { setPagination } = require("../utils/pagination");

exports.createRepost = asyncHandler(async (req, res) => {
  const { post, text } = req.body;
  const repost = await Repost.create({ post, text, user: req.user._id });
  res.status(200).json({
    status: "success",
    repost,
  });
});

exports.updateRepost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const repost = await Repost.findById(req.params.id);
  if (text) repost.text = text;
  await repost.save();
  res.status(200).json({
    status: "success",
    repost,
  });
});

exports.getSpecificRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findById(req.params.id);
  res.status(200).json({
    status: "success",
    repost,
  });
});

exports.deleteRepost = asyncHandler(async (req, res) => {
  await Repost.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ repost: req.params.id });
  res.status(200).json({
    status: "success",
    message: "Repost deleted successfully",
  });
});

exports.addLikeToRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  // const io = req.app.get('IO');
  // io.to(req.params.id).emit('number_of_likes', repost.likes.length);
  res.status(200).json({
    status: "success",
    likes: repost.likes,
  });
});

exports.removeLikeFromRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  // const io = req.app.get('IO');
  // io.to(req.params.id).emit('number_of_likes', repost.likes.length);
  res.status(200).json({
    status: "success",
    likes: repost.likes,
  });
});

exports.getAllLikesFromRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findById(req.params.id).populate({
    path: "likes",
    select: "firstName lastName image",
  });
  if (!repost) throw new Error("Repost not found");
  res.status(200).json({
    status: "success",
    likes: repost.likes,
  });
});
