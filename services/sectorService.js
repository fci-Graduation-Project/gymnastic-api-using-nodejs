const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Sector = require("../models/sectorModel");
const fs = require("fs");
const path = require("path");

// Function to ensure that the directory exists
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Upload single image
exports.uploadSectorImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `sector-${uuidv4()}-${Date.now()}.jpeg`;

  // Ensure that the directory exists
  const directory = path.join(__dirname, "..", "uploads", "sectors");
  ensureDirectoryExists(directory);

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(path.join(directory, filename));

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
