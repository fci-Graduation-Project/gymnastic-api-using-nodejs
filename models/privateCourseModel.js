const mongoose = require("mongoose");

const privateCourseSchema = new mongoose.Schema(
  {
    privateExercises: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        trainingName: String,
        count: Number,
        time: Number,
        videoUrl: String,
        imageCover: String,
        description: String,
        focusArea: [String],
      },
    ],
    quantity: {
      type: Number,
      default: 1,
    },
    Price: Number,
    coach: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrivateCourse", privateCourseSchema);
