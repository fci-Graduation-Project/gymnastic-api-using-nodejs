const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
// Routes
const mountRoutes = require("./routes");
// const { webhookCheckout } = require('./services/orderService');

// Connect with db
dbConnection();

// express app
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

// Mount Routes
mountRoutes(app);
//nnn
app.get("/", (req, res) => {
  // Send the image file as response
  res.sendFile(
    __dirname +
      "/uploads/users/user-fdb99ded-0828-4e66-a368-12187bebb073-1710469843782.jpeg"
  );
});

// app.get("/", (req, res) => {
//   res.send("<h1>صلي علي النبي كدا</br></br> 😎😂 متجيش عشان مفيش الالا </h1>");
// });
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
