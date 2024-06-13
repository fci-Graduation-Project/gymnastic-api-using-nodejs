const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "text is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
    repost: {
      type: mongoose.Schema.ObjectId,
      ref: "Repost",
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

CommentSchema.pre(/^find/, function (next) {
  this.select("-__v -updatedAt -createdAt");
  next();
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
