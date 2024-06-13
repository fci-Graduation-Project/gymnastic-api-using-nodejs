const mongoose = require("mongoose");

const repostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,

      ref: "User",
      required: [true, "User is required"],
    },
    post: {
      type: mongoose.Schema.ObjectId,

      ref: "Post",
      required: [true, "Post is required"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,

        ref: "User",
      },
    ],
    sharing: [
      {
        type: mongoose.Schema.ObjectId,

        ref: "User",
      },
    ],
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

repostSchema.pre(/^find/, function (next) {
  this.select("-__v -updatedAt -createdAt");
  next();
});
const RepostModel = mongoose.model("Repost", repostSchema);

module.exports = RepostModel;
