const express = require("express");

const {
  getSectorValidator,
  createSectorValidator,
  updateSectorValidator,
  deleteSectorValidator,
} = require("../utils/validators/sectorValidator");

const {
  getSectors,
  getSector,
  createSector,
  updateSector,
  deleteSector,
} = require("../services/sectorService");

const authService = require("../services/authService");

// const subcategoriesRoute = require('./levelRoute');

const router = express.Router();

// Nested route
// router.use('/:sectorId/subcategories', subcategoriesRoute);

router.route("/").get(getSectors).post(
  // authService.protect,
  // authService.allowedTo("admin", "manager"),
  createSectorValidator,
  createSector
);
router
  .route("/:id")
  .get(getSectorValidator, getSector)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updateSectorValidator,
    updateSector
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSectorValidator,
    deleteSector
  );

module.exports = router;
