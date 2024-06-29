const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const PrivateCourse = require("../models/privateCourseModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
exports.addExercise = asyncHandler(async (req, res, next) => {
  // const { productId, color } = req.body;
  // const product = await Product.findById(productId);

  // 1) Get Cart for logged user
  let exercise = await PrivateCourse.findOne({ coach: req.user._id });

  if (!exercise) {
    // create cart fot logged user with product
    exercise = await PrivateCourse.create({
      coach: req.user._id,
      ...req.body,
    });
  } else {
    req.body.privateExercises.forEach((ex) =>
      exercise.privateExercises.push(ex)
    );
    exercise.quantity = exercise.privateExercises.length;
    await exercise.save();
  }

  res.status(200).json({
    status: "success",
    msg: "exercise added to privateExercises successfully",
    numOfExercises: exercise.privateExercises.length,
    data: exercise,
  });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User

exports.getLoggedCoachCourse = asyncHandler(async (req, res, next) => {
  const exercise = await PrivateCourse.findOne({ coach: req.user._id });
  if (!exercise) {
    return next(
      new ApiError(
        `There is no privateExercises for this user id : ${req.user._id}`,
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    numOfExercises: exercise.privateExercises.length,
    data: exercise,
  });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const exercise = await PrivateCourse.findOneAndUpdate(
    { coach: req.user._id },
    {
      $pull: { privateExercises: { _id: req.params.itemId } },
    },
    { new: true }
  );

  exercise.quantity = exercise.privateExercises.length;
  await exercise.save();

  res.status(200).json({
    status: "success",
    msg: "Exercise remove from your privateExercises successfully",
    numOfExercises: exercise.privateExercises.length,
    data: exercise,
  });
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await PrivateCourse.findOneAndDelete({ coach: req.user._id });
  res.status(204).json({
    msg: "PrivateCourse empty",
  });
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  // const { privateExercisesId } = req.params;

  let exercise = await PrivateCourse.findOne({ coach: req.user._id });

  if (!exercise) {
    return next(
      new ApiError(`there is no exercise for coach ${req.user._id}`, 404)
    );
  }

  const itemIndex = exercise.privateExercises.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  console.log(req.params.itemId);
  console.log(item._id.toString());
  // console.log(exercise);
  console.log(itemIndex);
  // console.log(exercise._id);
  // console.log(exercise._id.toString());
  if (itemIndex > -1) {
    const updateData = { ...req.body };
    await PrivateCourse.updateOne(
      {
        // _id: exercise._id.toString(),
        "privateExercises._id": req.params.itemId,
      },
      { $set: { ["privateExercises"]: updateData } }
    );
  } else {
    return next(new ApiError("exercises not found", 404));
  }

  // Retrieve the updated sector
  // const updatedSector = await PrivateCourse.findById({ "privateExercises._id": exerciseId });
  let exercise1 = await PrivateCourse.findOne({ coach: req.user._id });
  console.log(exercise1);
  // Return the updated exercises type
  res.status(200).json({
    status: "success",
    message: "exercises type updated successfully.",
    data: exercise1.privateExercises[itemIndex],
  });
});
