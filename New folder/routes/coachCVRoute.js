const express = require("express");

// const {
//   getCategoryValidator,
//   createCategoryValidator,
//   updateCategoryValidator,
//   deleteCategoryValidator,
// } = require("../utils/validators/categoryValidator");

const {
  getCoachsCV,
  getCoachCV,
  createCoachCV,
  deleteCoachCV,
  updateCoachCV,
} = require("../services/coachCVService");

const authService = require("../services/authService");

// const subcategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

// Nested route
// router.use('/:categoryId/subcategories', subcategoriesRoute);

router.route("/").get(getCoachsCV).post(
  authService.protect,
  authService.allowedTo("admin", "user"),
  // uploadCategoryImage,
  // resizeImage,
  // createCategoryValidator,
  createCoachCV
);
router
  .route("/:id")
  .get(
    // getCategoryValidator,
    getCoachCV
  )
  .put(
    // authService.protect,
    // authService.allowedTo('admin', 'manager'),
    // uploadCategoryImage,
    // resizeImage,
    // updateCategoryValidator,
    updateCoachCV
  )
  .delete(
    // authService.protect,
    // authService.allowedTo('admin'),
    // deleteCategoryValidator,
    deleteCoachCV
  );

module.exports = router;
