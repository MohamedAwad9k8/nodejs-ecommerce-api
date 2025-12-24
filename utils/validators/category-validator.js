import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validator.middleware.js";

// @desc Validator Rules and middleware to get category by id
export const getCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to create a new category
export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name can't exceed 32 characters"),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update category by id
export const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name can't exceed 32 characters"),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete category by id
export const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
