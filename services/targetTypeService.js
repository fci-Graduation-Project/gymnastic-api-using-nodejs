const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

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

exports.removetarget = asyncHandler(async (req, res, next) => {
  const { sectorId, targetTypeId } = req.params; // Retrieve from request parameters
  const sector1 = await Sector.findById(sectorId);

  if (!sector1) {
    return next(new ApiError("Incorrect sectorId", 401));
  }
  // $pull => remove target object from sector targetType array if targetTypeId exist
  const sector = await Sector.findByIdAndUpdate(
    sectorId,
    {
      $pull: { targetType: { _id: targetTypeId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Target removed successfully.",
  });
});

// @desc    Get logged sector targetType list
// @route   GET /api/v1/targetType
// @access  Protected/sector
exports.gettargetType = asyncHandler(async (req, res, next) => {
  const { targetTypeId } = req.params;

  try {
    // Find the sector containing the targetType with the provided ID
    const sector = await Sector.findOne({ "targetType._id": targetTypeId });

    if (!sector) {
      return res.status(404).json({
        status: "fail",
        message: "TargetType not found.",
      });
    }

    // Find the targetType within the sector
    const targetType = sector.targetType.find(
      (type) => type._id === targetTypeId
    );

    if (!targetType) {
      return new ApiError("Incorrect sectorId", 401);
    }

    res.status(200).json({
      status: "success",
      data: targetType,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
});

exports.updateTargetType = asyncHandler(async (req, res, next) => {
  const { sectorId, targetTypeId } = req.params; // Retrieve from request parameters

  const sector = await Sector.findById(sectorId);

  if (!sector) {
    return next(new ApiError("Incorrect sectorId", 401));
  }

  // Find the index of the target type within the sector
  const targetTypeIndex = sector.targetType.findIndex(
    (type) => type._id == targetTypeId
  );

  if (targetTypeIndex === -1) {
    return next(new ApiError("TargetType not found", 404));
  }

  // Update the target type with the provided data using $set and req.body
  const updateData = { ...req.body };
  await Sector.updateOne(
    { _id: sectorId, "targetType._id": targetTypeId },
    { $set: { ["targetType"]: updateData } }
  );

  // Retrieve the updated sector
  const updatedSector = await Sector.findById(sectorId);

  // Return the updated target type
  res.status(200).json({
    status: "success",
    message: "Target type updated successfully.",
    data: updatedSector.targetType[targetTypeIndex],
  });
});
