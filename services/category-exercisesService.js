const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const cloudinary = require("cloudinary").v2;
const Sector = require("../models/category-exercisesModel");

exports.uploadSectorImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const transformationOptions = {
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "auto",
      format: "auto",
      quality: "auto",
    };
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "gymnastic/sectorexercise",
      transformation: transformationOptions,
    });
    const { public_id, secure_url } = result;
    req.body.image = { publicId: public_id, url: secure_url };
    console.log(req.file);
  }
  next();
});

// @desc    Get list of sector
// @route   GET /api/v1/sector
// @access  Public
exports.getSectors = factory.getAll(Sector);

// @desc    Get specific Sector by id
// @route   GET /api/v1/sector/:id
// @access  Public
exports.getSector = factory.getOne(Sector);

// @desc    Create Sector
// @route   POST  /api/v1/sector
// @access  Private/Admin-Manager
exports.createSector = factory.createOne(Sector);

// @desc    Update specific Sector
// @route   PUT /api/v1/sector/:id
// @access  Private/Admin-Manager
exports.updateSector = factory.updateOne(Sector);

// @desc    Delete specific Sector
// @route   DELETE /api/v1/sector/:id
// @access  Private/Admin
exports.deleteSector = factory.deleteOne(Sector);
