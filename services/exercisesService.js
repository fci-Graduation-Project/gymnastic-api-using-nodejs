const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Sector = require("../models/sectorModel");

// @desc    Add exercises to sector exercises list
// @route   POST /api/v1/exercises
// @access  Protected/sector
exports.addexercises = asyncHandler(async (req, res, next) => {
  // $addToSet => add exercises object to sector exercises  array if exercises not exist
  const { sectorId, exercises } = req.body;

  const sector = await Sector.findByIdAndUpdate(
    sectorId,
    {
      $addToSet: { exercises },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "exercises added successfully.",
    data: sector.exercises,
  });
});

exports.removeexercises = asyncHandler(async (req, res, next) => {
  const { sectorId, exercisesId } = req.params; // Retrieve from request parameters
  const sector1 = await Sector.findById(sectorId);

  if (!sector1) {
    return next(new ApiError("Incorrect sectorId", 401));
  }
  // $pull => remove exercises object from sector exercises array if exercisesId exist
  const sector = await Sector.findByIdAndUpdate(
    sectorId,
    {
      $pull: { exercises: { _id: exercisesId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "exercises removed successfully.",
  });
});

// @desc    Get logged sector exercises list
// @route   GET /api/v1/exercises
// @access  Protected/sector
exports.getexercises = asyncHandler(async (req, res, next) => {
  const exercisesId = req.params.exercisesId;

  try {
    // Find the sector containing the exercises with the provided ID
    const sector = await Sector.findOne({ "exercises._id": exercisesId });

    if (!sector) {
      return res.status(404).json({
        status: "fail",
        message: "exercises not found.",
      });
    }

    // Find the exercises within the sector
    const exercises = sector.exercises.find((type) => type._id == exercisesId);

    if (!exercises) {
      return next(new ApiError("Incorrect exercisesId", 401));
    }

    res.status(200).json({
      status: "success",
      data: exercises,
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

exports.updateexercises = asyncHandler(async (req, res, next) => {
  const { sectorId, exercisesId } = req.params; // Retrieve from request parameters

  const sector = await Sector.findById(sectorId);

  if (!sector) {
    return next(new ApiError("Incorrect sectorId", 401));
  }

  // Find the index of the exercises type within the sector
  const exercisesIndex = sector.exercises.findIndex(
    (type) => type._id == exercisesId
  );

  if (exercisesIndex === -1) {
    return next(new ApiError("exercises not found", 404));
  }

  // Update the exercises type with the provided data using $set and req.body
  const updateData = { ...req.body };
  await Sector.updateOne(
    { _id: sectorId, "exercises._id": exercisesId },
    { $set: { ["exercises"]: updateData } }
  );

  // Retrieve the updated sector
  const updatedSector = await Sector.findById(sectorId);

  // Return the updated exercises type
  res.status(200).json({
    status: "success",
    message: "exercises type updated successfully.",
    data: updatedSector.exercises[exercisesIndex],
  });
});
