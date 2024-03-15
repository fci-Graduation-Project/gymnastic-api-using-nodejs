const sectorRoute = require("./sectorRoute");
const exercisesRoute = require("./exercisesRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/sector", sectorRoute);
  app.use("/api/v1/exercise", exercisesRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
};

module.exports = mountRoutes;
