const sectorRoute = require("./sectorRoute");
const exercisesRoute = require("./exercisesRoute");
const userRoute = require("./userRoute");
const reviewRoute = require("./reviewRoute");
const authRoute = require("./authRoute");
const postRoute = require("./postRoute");
const commentRoute = require("./commentRoute");
const repostRoute = require("./repostRoute");
const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");
const reviewCoachRoute = require("./reviewCoachRoute");
const wishlistRoute = require("./wishlistRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");
const coachCVRoute = require("./coachCVRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/sector", sectorRoute);
  app.use("/api/v1/exercise", exercisesRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/reviewCoach", reviewCoachRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/posts", postRoute);
  app.use("/api/v1/comments", commentRoute);
  app.use("/api/v1/reposts", repostRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/coachCV", coachCVRoute);
};

module.exports = mountRoutes;

//
