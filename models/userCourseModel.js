const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseItems: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId, // Use Types.ObjectId here
          ref: "PrivateCourse", // Reference the model name of PrivateCourse
        },
        trainingName: String,
        count: Number,
        time: Number,
        videoUrl: String,
        imageCover: String,
        animationUrl: String,
        description: String,
        focusArea: [String],

        finished: {
          type: Boolean,
          default: false,
        },
        percentage: {
          type: Number,
          default: 0,
        },
        time: {
          type: Date,
          default: Date.now, // Set the default value to the current date and time
        },
      },
    ],
    totalPercentage: {
      type: Number,
      default: 0,
    },
    courseName: String,
    price: Number,
    isPaid: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Use Types.ObjectId here
      ref: "User",
    },
    coach: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
