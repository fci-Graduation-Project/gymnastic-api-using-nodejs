const asyncHandler = require("express-async-handler");
// const { v4: uuidv4 } = require("uuid");
// const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");
const User = require("../models/userModel");
const coachCV = require("../models/coachCVModel");

const getFollowing = async (model, id) =>
  await model.findById(id).populate({
    path: "following",
    select: "_id email ",
  });

const getFollowers = async (model, id) =>
  await model.findById(id).populate({
    path: "followers",
    select: "_id email",
  });
// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    // console.log(req.file);
    const transformationOptions = {
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "auto",
      format: "auto",
      quality: "auto", // Automatically optimize quality
    };
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "gymnastic/users", // Specify Cloudinary folder
      // resource_type: "video", // Specify resource type as "video"
      transformation: transformationOptions, // Apply transformations
    });
    // eslint-disable-next-line camelcase
    const { public_id, secure_url } = result;
    // console.log(result);
    // eslint-disable-next-line camelcase
    req.body.profileImg = { publicId: public_id, url: secure_url };
  }

  next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = factory.getOne(User, "reviews");

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      profileImg: req.body.profileImg,
      weight: req.body.weight,
      height: req.body.height,
      gender: req.body.gender,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});

exports.addFollowers = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.body.follow,
    { $addToSet: { followers: req.user._id } },
    { new: true }
  );
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { following: req.body.follow },
  });
  res.status(200).json({
    success: "success",
    following: {
      _id: user._id,
      following: user.followers,
    },
  });
});

exports.removeFollowers = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.body.follow,
    { $pull: { followers: req.user._id } },
    { new: true }
  );
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: req.body.follow },
  });
  res.status(200).json({
    success: "success",
    following: {
      _id: user._id,
      following: user.followers,
    },
  });
});

exports.getFollowingUserById = asyncHandler(async (req, res) => {
  const user = await getFollowing(User, req.params.id);
  res.status(200).json({
    success: "success",
    count: user.following.length,
    following: user.following,
  });
});

exports.getFollowersUserById = asyncHandler(async (req, res) => {
  const user = await getFollowers(User, req.params.id);
  res.status(200).json({
    success: "success",
    count: user.followers.length,
    followers: user.followers,
  });
});

exports.getFollowingMe = asyncHandler(async (req, res) => {
  req.params.id = req.user._id;
  const user = await getFollowing(User, req.params.id);
  res.status(200).json({
    success: "success",
    count: user.following.length,
    following: user.following,
  });
});

exports.getFollowersMe = asyncHandler(async (req, res) => {
  req.params.id = req.user._id;

  const user = await getFollowers(User, req.params.id);
  console.log(user);
  res.status(200).json({
    success: "success",
    count: user.followers.length,
    followers: user.followers,
  });
});

exports.updateUsertoCoach = asyncHandler(async (req, res, next) => {
  // Find the coach CV document for the user
  const CV = await coachCV.findOne(req.params.user);
  if (CV) {
    const updatedCoach = await User.findByIdAndUpdate(
      req.params.id,
      {
        experience_years: CV.experience_years,
        certifications: CV.certifications,
        medals: CV.medals,
      },
      { new: true }
    );

    // Send a success response with the updated user document
    await coachCV.findOneAndDelete(req.params.user);

    console.log(updatedCoach);
    res.status(200).json({
      success: "success",
      updatedCoach,
    });
  } else {
    return next(new ApiError("Coach CV not found", 404));
  }
  // Update the user document with coach CV details
});
