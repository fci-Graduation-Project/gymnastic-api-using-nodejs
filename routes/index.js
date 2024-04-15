const sectorRoute = require("./sectorRoute");
const exercisesRoute = require("./exercisesRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const postRoute = require("./postRoute");
const commentRoute = require("./commentRoute.js");
const repostRoute = require("./repostRoute.js");

const mountRoutes = (app) => {
  app.use("/api/v1/sector", sectorRoute);
  app.use("/api/v1/exercise", exercisesRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/posts", postRoute);
  app.use("/api/v1/comments", commentRoute);
  app.use("/api/v1/reposts", repostRoute);
};

module.exports = mountRoutes;

// const authRoute = require('./auth.route.js');
// const postRoute = require('./post.route.js');
// const commentRoute = require('./comment.route.js');
// const chatRoute = require('./chat.route.js');
// const repostRoute = require('./repost.route.js');
// const userRoute = require('./user.route.js');

// module.exports = (app) => {
//   app.use('/api/v1/auth', authRoute);
//   app.use('/api/v1/posts', postRoute);
//   app.use('/api/v1/comments', commentRoute);
//   app.use('/api/v1/chats', chatRoute);
//   app.use('/api/v1/reposts', repostRoute);
//   app.use('/api/v1/users',
