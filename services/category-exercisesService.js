const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");
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
// exports.getSectors = factory.getAll(Sector, "Products");

exports.getOnlySectors = asyncHandler(async (req, res, next) => {
  const { sector, level, age } = req.query;

  // Validate the age if it's provided
  let parsedAge;
  if (age) {
    parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge)) {
      return next(new ApiError("Invalid age format", 400));
    }
  }

  // Build the query object dynamically based on the provided query parameters
  const query = {};
  if (sector) query.sector = sector;
  if (level) query.level = level;

  // Find the documents based on sector and/or level
  let documents = await Sector.find(query).select(
    "sector level image age createdAt updatedAt"
  );

  // Filter documents based on age if it's provided
  if (age) {
    documents = documents.filter((doc) => {
      const [min, max] = doc.age.split("-").map(Number);
      return parsedAge >= min && parsedAge <= max;
    });
  }

  // Handle the case where no documents are found
  if (documents.length === 0) {
    return next(new ApiError("No documents found", 404));
  }

  // Respond with the filtered documents
  res.status(200).json({ count: documents.length, data: documents });
});

exports.getSectors = asyncHandler(async (req, res, next) => {
  const { sector, level, age } = req.query;

  // Validate the age if it's provided
  let parsedAge;
  if (age) {
    parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge)) {
      return next(new ApiError("Invalid age format", 400));
    }
  }

  // Build the query object dynamically based on the provided query parameters
  const query = {};
  if (sector) query.sector = sector;
  if (level) query.level = level;

  // Find the documents based on sector and/or level
  let documents = await Sector.find(query);
  // Filter documents based on age if it's provided
  if (age) {
    documents = documents.filter((doc) => {
      const [min, max] = doc.age.split("-").map(Number);
      return parsedAge >= min && parsedAge <= max;
    });
  }

  // Handle the case where no documents are found
  if (documents.length === 0) {
    return next(new ApiError("No documents found", 404));
  }

  // Respond with the filtered documents
  res.status(200).json({ count: documents.length, data: documents });
});
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
