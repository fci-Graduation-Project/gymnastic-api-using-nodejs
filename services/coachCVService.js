// const sharp = require('sharp');
// const { v4: uuidv4 } = require('uuid');
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
// const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const coachCV = require("../models/coachCVModel");

// Upload single image
// exports.uploadcoachCVImage = uploadSingleImage('image');

// Image processing
// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

//   if (req.file) {
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat('jpeg')
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/categories/${filename}`);

//     // Save image into our db
//     req.body.image = filename;
//   }

//   next();
// });

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCoachsCV = factory.getAll(coachCV);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCoachCV = factory.getOne(coachCV);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private/Admin-Manager
exports.createCoachCV = asyncHandler(async (req, res) => {
  // const { post, text } = req.body;
  const CV = await coachCV.create(req.body, { user: req.user._id });
  res.status(200).json({
    status: "success",
    CV,
  });
});

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updateCoachCV = factory.updateOne(coachCV);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCoachCV = factory.deleteOne(coachCV);
