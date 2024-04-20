const mongoose = require("mongoose");
const User = require("./userModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "Review ratings required"],
    },
    reviewer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Reviewer required"],
    },
    reviewee: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Reviewee required"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "reviewer", select: "name" });
  this.populate({ path: "reviewee", select: "name" });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (userId) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews for specific user
    {
      $match: { reviewee: userId },
    },
    // Stage 2: Grouping reviews based on reviewee and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "reviewee",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await User.findByIdAndUpdate(userId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.reviewee);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.reviewee);
});

module.exports = mongoose.model("ReviewCoach", reviewSchema);
