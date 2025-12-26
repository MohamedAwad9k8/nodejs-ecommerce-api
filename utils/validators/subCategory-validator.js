import { check } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import { categoryRules, idRules, nameRules } from './validation-rules.js';

// @desc Validator Rules and middleware to get Subcategory by id
export const getSubCategoryByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new Subcategory
export const createSubCategoryValidator = [
  nameRules(true),
  categoryRules(true),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update Subcategory by id
export const updateSubCategoryValidator = [
  idRules(),
  nameRules(false),
  categoryRules(false),
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
