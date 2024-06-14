const mongoose = require("mongoose");

const coachCVSchema = new mongoose.Schema(
  {
    experience_years: Number,
    certifications: [String],
    medals: [
      {
        event: String,
        competition: String,
        medal_type: String,
        date: Date,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoachCV", coachCVSchema);
