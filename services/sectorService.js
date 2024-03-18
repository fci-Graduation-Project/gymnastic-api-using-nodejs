const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Sector = require("../models/sectorModel");
// a
// Upload single image
exports.uploadSectorImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `sector-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/sectors/${filename}`);

    // Save image into our db
    req.body.image = filename;
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
