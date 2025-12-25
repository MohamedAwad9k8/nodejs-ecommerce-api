import { check } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validator.middleware.js';

// @desc Validator Rules and middleware to get Brand by id
export const getBrandByIdValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to create a new Brand
export const createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 2 })
    .withMessage('Brand name must be at least 2 characters')
    .isLength({ max: 32 })
    .withMessage("Brand name can't exceed 32 characters"),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update Brand by id
export const updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 3 })
    .withMessage('Brand name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage("Brand name can't exceed 32 characters"),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete Brand by id
export const deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];
