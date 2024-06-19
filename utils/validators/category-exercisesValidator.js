const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const SectorModel = require("../../models/category-exercisesModel");

exports.getSectorValidator = [
  check("id").isMongoId().withMessage("Invalid sector id format"),
  validatorMiddleware,
];

exports.createSectorValidator = [
  check("sector")
    .notEmpty()
    .withMessage("Sector is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Sector name should be between 2 and 32 characters")
    .custom(async (sector, { req }) => {
      const existingSector = await SectorModel.findOne({
        sector: sector,
        level: req.body.level,
        target: req.body.target,
      });

      if (existingSector) {
        throw new Error("this data already exists");
      }

      return true;
    }),
  check("image")
    // .notEmpty()
    .optional(),

  // .withMessage("image is required"),
  check("level")
    .notEmpty()
    .withMessage("Level is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Level name should be between 2 and 32 characters"),

  check("target")
    .notEmpty()
    .withMessage("Target is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Target name should be between 2 and 32 characters"),

  validatorMiddleware,
];

exports.updateSectorValidator = [
  check("id").isMongoId().withMessage("Invalid sector id format"),
  check("sector")
    .optional()
    .custom(async (value, { req }) => {
      // Only validate gender if the role is "user"
      const existingSector = await SectorModel.findOne({
        sector: value,
        level: req.body.level,
        target: req.body.target,
      });

      if (existingSector) {
        throw new Error("this data already exists");
      }
      return true;
    }),
  check("level").optional(),
  validatorMiddleware,
];

exports.deleteSectorValidator = [
  check("id").isMongoId().withMessage("Invalid sector id format"),
  validatorMiddleware,
];
