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
        AnimationUrl: String,
        description: String,
        focusArea: [String],
      },
    ],
    nameofcourse: String,
    Price: Number,
    coach: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrivateCourse", privateCourseSchema);
