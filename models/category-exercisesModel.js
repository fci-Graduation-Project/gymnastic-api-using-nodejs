const mongoose = require("mongoose");
// const slugify = require("slugify");

const sectorSchema = new mongoose.Schema(
  {
    sector: {
      type: String,
      // enum: ["Basics", "Flexibility", "Inversion", "Mobility"],
      required: [true, "Sector is required"],
      minlength: [2, "Too short sector name"],
      maxlength: [32, "Too long sector name"],
    },
    level: {
      type: String,
      // enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Level is required"],
      minlength: [2, "Too short level name"],
      maxlength: [32, "Too long level name"],
    },
    age: {
      type: String,
      required: [true, "age is required"],
      minlength: [2, "Too short target name"],
      maxlength: [32, "Too long target name"],
    },
    image: {
      publicId: String,
      url: String,
      // required: [true, "image is required"],
    },
    exercises: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        trainingName: String,
        count: Number,
        time: Number,
        image: String,
        animationUrl: String,
        videoUrl: String,
        description: String,
        focusArea: [String],
      },
    ],
    slug: String,
  },
  { timestamps: true }
);

const SectorModel = mongoose.model("Sector", sectorSchema);

module.exports = SectorModel;
