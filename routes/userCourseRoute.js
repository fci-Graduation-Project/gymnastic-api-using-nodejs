const express = require("express");

const {
  addExerciseToCourse,
  getLoggedUserCourse,
  updateCourseItemFinished,
  removeSpecificCourseItem,
  clearCourse,
  checkoutSession,
} = require("../services/userCourseService");
const authService = require("../services/authService");

const router = express.Router();

router.use(
  authService.protect,
  authService.allowedTo("admin", "coach", "user")
);
router.get(
  "/checkout-session/:exerciseId",
  authService.allowedTo("user"),
  checkoutSession
);

router
  .route("/")
  .post(addExerciseToCourse)
  .get(getLoggedUserCourse)
  .delete(clearCourse);

router
  .route("/:itemId")
  .put(updateCourseItemFinished)
  .delete(removeSpecificCourseItem);

module.exports = router;
