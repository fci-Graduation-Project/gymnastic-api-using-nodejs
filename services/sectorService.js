const factory = require("./handlersFactory");
const Sector = require("../models/sectorModel");

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
