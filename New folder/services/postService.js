const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const { setPagination } = require("../utils/pagination");
const {
  // uploadSingleImage,
  uploadMixOfImages,
} = require("../middlewares/uploadImageMiddleware");

const User = require("../models/userModel");

// const uploadUserImage = uploadSingleImage("video");
// Middleware to upload multiple images
const uploadUserImage = uploadMixOfImages([
  {
    name: "video",
    maxCount: 5, // Adjust as needed
  },
]);

// Middleware to resize uploaded images
const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.video) {
    return next(new ApiError("No video files provided", 400));
  }

  req.body.video = [];

  await Promise.all(
    req.files.video.map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "video",
          folder: "gymnastic/postsVideo", // Specify Cloudinary folder
          // Apply transformations if needed
        });

        req.body.video.push({
          publicId: result.public_id,
          url: result.secure_url,
        });
      } catch (error) {
        console.error("Error uploading video:", error);
        return next(new ApiError("Failed to upload video", 500));
      }
    })
  );

  next();
});

//   req.body.video = [];
//   // Upload file to Cloudinary
//   const result = await cloudinary.uploader.upload(req.file.path, {
//     resource_type: "video",
//     folder: "gymnastic/postsVideo", // Specify Cloudinary folder
//     // resource_type: "video", // Specify resource type as "video"
//     // transformation: transformationOptions, // Apply transformations
//   });
//   // eslint-disable-next-line camelcase
//   const { public_id, secure_url } = result;
//   // console.log(result);
//   // eslint-disable-next-line camelcase
//   req.body.video.push({ publicId: public_id, url: secure_url });
//   // req.body.images.push(imageName);
// }

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
  if (!post) throw new ApiError("Post not found");
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
  resizeImage,
  uploadUserImage,
};
