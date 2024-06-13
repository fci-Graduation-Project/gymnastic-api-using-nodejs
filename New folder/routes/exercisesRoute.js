const express = require("express");

// const authService = require("../services/authService");

const {
  addexercises,
  removeexercises,
  getexercises,
  updateexercises,
} = require("../services/exercisesService");

const router = express.Router();

// router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addexercises);
router.route("/:exercisesId").get(getexercises);
router
  .route("/sector/:sectorId/exercise/:exercisesId")
  .delete(removeexercises)
  .put(updateexercises);
// router.put("/sectors/:sectorId/exercisess/:exercisesId", updateexercises);

// router.delete("/", removeexercises);
module.exports = router;
