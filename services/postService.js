const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const { setPagination } = require("../utils/pagination");

const User = require("../models/userModel");

const createPost = asyncHandler(async (req, res) => {
  const { text, image, video } = req.body;
  if (!req.user) {
    return res
      .status(401)
      .json({ status: "error", message: "User not authenticated" });
  }

  const post = await Post.create({ text, image, video, user: req.user._id });
  res.status(200).json({
    status: "success",
    post,
  });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { limit, pagination, skip } = await setPagination(Post, req);
  const user = await User.findById(req.user._id);
  const allPosts = await Post.aggregate([
    {
      $match: { user: { $in: user.following || [] } },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $project: {
        text: 1,
        image: 1,
        video: 1,
        likes: 1,
        user: 1,
        comments: 1,
        numberOfComments: { $size: "$comments" },
      },
    },
    { $limit: limit },
    { $skip: skip },
  ]);

  res.status(200).json({
    status: "success",
    count: allPosts.length,
    pagination,
    allPosts,
  });
});

const getAllMyPosts = asyncHandler(async (req, res) => {
  const { limit, pagination, skip } = await setPagination(Post, req);
  const allPosts = await Post.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $lookup: {
        from: "reposts",
        localField: "user",
        foreignField: "user",
        as: "reposts",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $project: {
        text: 1,
        image: 1,
        video: 1,
        likes: 1,
        user: 1,
        "comments._id": 1,
        "comments.text": 1,
        "comments.user": 1,
        "comments.likes": 1,
        "reposts._id": 1,
        "reposts.user": 1,
        numberOfComments: { $size: "$comments" },
      },
    },
    { $limit: limit },
    { $skip: skip },
  ]);

  res.status(200).json({
    status: "success",
    count: allPosts.length,
    pagination,
    allPosts,
  });
});

const getSpecificPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json({
    status: "success",
    post,
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { text, image, video } = req.body;
  const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
  if (text) post.text = text;
  if (image) post.image = image;
  if (video) post.video = video;
  await post.save();
  res.status(200).json({
    status: "success",
    post,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  await Comment.deleteMany({ post: req.params.id });
  res.status(200).json({
    status: "success",
    message: "Post deleted successfully",
  });
});

const addLike = asyncHandler(async (req, res) => {
  // const io = req.app.get("IO");
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  // io.to(req.params.id).emit("number_of_likes", post.likes.length);
  res.status(200).json({
    status: "success",
    likes: post.likes,
  });
});

const removeLike = asyncHandler(async (req, res) => {
  const io = req.app.get("IO");
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  io.to(req.params.id).emit("number_of_likes", post.likes.length);
  res.status(200).json({
    status: "success",
    likes: post.likes,
  });
});

const getAllLikes = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate({
    path: "likes",
    select: "firstName lastName image",
  });
  if (!post) throw new NotFound("Post not found");
  res.status(200).json({
    status: "success",
    likes: post.likes,
  });
});

module.exports = {
  createPost,
  getAllPosts,
  getAllMyPosts,
  getSpecificPost,
  updatePost,
  deletePost,
  addLike,
  removeLike,
  getAllLikes,
};
