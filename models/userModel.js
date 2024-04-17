const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      // required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    age: Number,
    height: Number,
    weight: Number,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    // profileImg: {
    //   url: String,
    //   publicId: String,
    // },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
      // maxlength: [15, "Too short password"],
    },

    role: {
      type: String,
      //coach
      enum: ["user", "coach", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    following: [
      {
        type: mongoose.Schema.ObjectId,

        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.ObjectId,

        // type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "reviewee",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
