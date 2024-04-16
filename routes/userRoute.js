const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
  addFollowingValidator,
  removeFollowingValidator,
  getFollowingValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  addFollowers,
  removeFollowers,
  getFollowersMe,
  getFollowersUserById,
  getFollowingMe,
  getFollowingUserById,
} = require("../services/userService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  changeUserPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  "/updateMe",
  // uploadUserImage,
  resizeImage,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.delete("/deleteMe", deleteLoggedUserData);

// Admin
router.use(authService.allowedTo("admin", "manager", "user"));
router.put(
  "/changePassword/:id",

  changeUserPassword
);
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.route("/add-follower").patch(addFollowingValidator, addFollowers);
router
  .route("/remove-follower")
  .patch(removeFollowingValidator, removeFollowers);
router.get("/following/:id", getFollowingUserById);

router.get("/followers/:id", getFollowersUserById);

router.route("/following-me").get(getFollowingValidator, getFollowingMe);

router.get("/followers-me", getFollowingValidator, getFollowersMe);

module.exports = router;
