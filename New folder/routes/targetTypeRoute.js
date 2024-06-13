const express = require("express");

// const authService = require("../services/authService");

const {
  addtarget,
  removetarget,
  gettargetType,
  updateTargetType,
} = require("../services/targetTypeService");

const router = express.Router();

// router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addtarget);
router.route("/:targetTypeId").get(gettargetType);
router
  .route("/sector/:sectorId/targetType/:targetTypeId")
  .delete(removetarget)
  .put(updateTargetType);
// router.put("/sectors/:sectorId/targetTypes/:targetTypeId", updateTargetType);

// router.delete("/", removetarget);
module.exports = router;
