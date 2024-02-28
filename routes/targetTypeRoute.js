const express = require("express");

// const authService = require("../services/authService");

const {
  addtarget,
  removetarget,
  getLoggedsectortargetType,
} = require("../services/targetTypeService");

const router = express.Router();

// router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addtarget).get(getLoggedsectortargetType);

router.delete("/:targetId", removetarget);

module.exports = router;
