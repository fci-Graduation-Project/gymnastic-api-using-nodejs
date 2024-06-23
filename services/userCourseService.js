const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const Exercise = require("../models/privateCourseModel");
const Course = require("../models/userCourseModel");

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
exports.addExerciseToCourse = asyncHandler(async (req, res, next) => {
  const { ExerciseId, user } = req.body;
  const user1 = await User.findById(user);
  if (!user1) {
    return next(new ApiError(`There is no user with id ${req.body.user}`, 404));
  }
  const exercise = await Exercise.findOne({
    coach: req.user._id,
    "privateExercises._id": ExerciseId,
  });
  // console.log(exercise);
  if (!exercise) {
    return next(
      new ApiError(
        `There is no user with id ${ExerciseId} or you not allow for this exercises `,
        404
      )
    );
  }

  let course = await Course.findOne({ user });
  // console.log(course);

  if (!course) {
    // create cart fot logged user with product
    course = await Course.create({
      coach: req.user._id,
      user,
      courseItems: [{ exercise: ExerciseId }],
    });
    // console.log(course);
  } else {
    // product exist in cart, update product quantity
    const exerciseIndex = course.courseItems.findIndex(
      (item) => item.exercise.toString() === ExerciseId
    );

    if (exerciseIndex > -1) {
      return next(
        new ApiError(`this id exist in courseItems  ${ExerciseId} `, 404)
      );
    } else {
      course.courseItems.push({ exercise: ExerciseId });
    }
  }
  await course.save();
  // Calculate total cart price
  // calcTotalCartPrice(cart);/
  // await cart.save();

  res.status(200).json({
    status: "success",
    msg: "exercise added to courseItems successfully",
    numOfCartItems: course.courseItems.length,
    data: course.courseItems,
  });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
exports.getLoggedUserCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({ user: req.user._id });
  // .populate({
  //   path: "courseItems.exercise",
  //   // model: "Exercise", // Ensure this matches your PrivateCourse model name
  // });
  // console.log(course);
  if (!course) {
    return next(
      new ApiError(`There is no course for this user id: ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    numOfCourseItems: course.courseItems.length,
    data: course,
  });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCourseItem = asyncHandler(async (req, res, next) => {
  const course = await Course.findOneAndUpdate(
    { coach: req.user._id },
    {
      $pull: { courseItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    msg: "exercises remove from your course successfully",
    numOfCartItems: course.courseItems.length,
    data: course,
  });
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCourse = asyncHandler(async (req, res, next) => {
  await Course.findOneAndDelete({ coach: req.user._id });
  res.status(204).json({
    msg: "Course empty",
  });
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCourseItemFinished = asyncHandler(async (req, res, next) => {
  // const { finished } = req.body;

  if (req.user.role == "coach") {
    return next(new ApiError(`you not allow to update ${req.user._id}`, 404));
  }
  const exercise = await Course.findOne({ user: req.user._id });
  // console.log(req.user.role);
  if (!exercise) {
    return next(
      new ApiError(`there is no exercise for user ${req.user._id}`, 404)
    );
  }

  const itemIndex = exercise.courseItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  let finished = exercise.courseItems[itemIndex].finished;
  if (itemIndex === -1) {
    return next(
      new ApiError(
        `there is no exercise for this id :${req.params.itemId}`,
        404
      )
    );
  } else if (finished == true) {
    return next(new ApiError("you alredy finished it ", 400));
  } else {
    const courseItem = exercise.courseItems[itemIndex];
    courseItem.finished = true;
    courseItem.time = Date.now();
    let numorder = itemIndex + 1;
    console.log(numorder);
    console.log(exercise.courseItems.length);
    exercise.totalPercentage = (numorder * 100) / exercise.courseItems.length;
    console.log(exercise.totalPercentage);
    courseItem.percentage = exercise.totalPercentage;
    console.log(courseItem.percentage);
    exercise.courseItems[itemIndex] = courseItem;
  }
  // console.log(item._id);
  // console.log(exercise.courseItems[itemIndex].finished);

  await exercise.save();

  res.status(200).json({
    status: "success",
    numOfcourseItems: itemIndex + 1,
    data: exercise,
  });
});

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // 1) Get cart depend on cartId
  const exercise = await Exercise.findById(req.params.exerciseId);
  if (!exercise) {
    return next(
      new ApiError(
        `There is no such course with id ${req.params.exerciseId}`,
        404
      )
    );
  }
  console.log(exercise.Price);
  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: exercise.Price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/exercise`,
    cancel_url: `${req.protocol}://${req.get("host")}/private`,
    customer_email: req.user.email,
    client_reference_id: req.params.exerciseId,
  });
  // 4) send session to response
  res.status(200).json({ status: "success", session });
});

const addUserToCoach = async (session) => {
  const exerciseId = session.client_reference_id;
  const exercise = await User.findById(exerciseId.coach);
  const user = await User.findOne(session.customer_email);
  console.log(coach);
  console.log(user);

  exercise.Trainees.push(user._id);
  await exercise.save();

  console.log(coach.Trainees.push(user._id));
};
// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    //  Create order
    addUserToCoach(event.data.object);
  }

  res.status(200).json({ received: true });
});
