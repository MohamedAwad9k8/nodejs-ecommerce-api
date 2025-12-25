import { check } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validator.middleware.js';

// @desc Validator Rules and middleware to get Subcategory by id
export const getSubCategoryByIdValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id format'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to create a new Subcategory
export const createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory name is required')
    .isLength({ min: 3 })
    .withMessage('SubCategory name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage("SubCategory name can't exceed 32 characters"),
  check('category')
    .notEmpty()
    .isMongoId()
    .withMessage('Invalid category id format'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update Subcategory by id
export const updateSubCategoryValidator = [
  check('id')
    .notEmpty()
    .isMongoId()
    .withMessage('Invalid Subcategory id format'),
  check('name')
    .notEmpty()
    .withMessage('SubCategory name is required')
    .isLength({ min: 3 })
    .withMessage('SubCategory name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage("SubCategory name can't exceed 32 characters"),
  check('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category id format'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete Subcategory by id
export const deleteSubCategoryValidator = [
  check('id')
    .notEmpty()
    .isMongoId()
    .withMessage('Invalid Subcategory id format'),
  validatorMiddleware,
];
