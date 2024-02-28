const asyncHandler = require("express-async-handler");

const Sector = require("../models/sectorModel");

// @desc    Add target to sector targetType list
// @route   POST /api/v1/targetType
// @access  Protected/sector
exports.addtarget = asyncHandler(async (req, res, next) => {
  // $addToSet => add target object to sector targetType  array if target not exist
  const { sectorId, targetType } = req.body;

  const sector = await Sector.findByIdAndUpdate(
    sectorId,
    {
      $addToSet: { targetType },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "targetType added successfully.",
    data: sector.targetType,
  });
});

// @desc    Remove target from sector targetType list
// @route   DELETE /api/v1/targetType/:targetTypeId
// @access  Protected/sector
exports.removetarget = asyncHandler(async (req, res, next) => {
  // $pull => remove target object from sector targetType array if targetTypeId exist
  const sector = await Sector.findByIdAndUpdate(
    req.sector._id,
    {
      $pull: { targetType: { _id: req.params.targetTypeId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "target removed successfully.",
    data: sector.targetType,
  });
});

// @desc    Get logged sector targetType list
// @route   GET /api/v1/targetType
// @access  Protected/sector
exports.getLoggedsectortargetType = asyncHandler(async (req, res, next) => {
  const sector = await Sector.findById(req.sector._id).populate("targetType");

  res.status(200).json({
    status: "success",
    results: sector.targetType.length,
    data: sector.targetType,
  });
});
