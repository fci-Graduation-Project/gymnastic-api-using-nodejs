const express = require("express");

const {
  addExercise,
  getLoggedCoachCourse,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
} = require("../services/privateCourseService");
const authService = require("../services/authService");

const router = express.Router();

router.use(
  authService.protect,
  authService.allowedTo("admin", "coach", "user")
);
router.route("/").post(addExercise).get(getLoggedCoachCourse).delete(clearCart);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;
