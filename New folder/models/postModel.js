// import { Schema, model } from "mongoose";
const { mongoose, model } = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "text required"],
    },
    image: String,
    video: [
      {
        url: String,
        publicId: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.ObjectId,

        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    sharing: [
      {
        type: mongoose.Schema.ObjectId,

        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre(/^find/, function (next) {
  this.select("-__v -createdAt -updatedAt");
  next();
});

postSchema.post("aggregate", async (doc, next) => {
  await Promise.all(
    doc.map(async (post) => {
      await Promise.all(
        post.comments.map(async (comment) => {
          comment.user = await model("User")
            .findById(comment.user)
            .select("firstName lastName image");
        })
      );
      await Promise.all(
        post.reposts.map(async (repost) => {
          repost.user = await model("User")
            .findById(repost.user)
            .select("firstName lastName image");
        })
      );
    })
  );
});

// export default model("Post", postSchema);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
