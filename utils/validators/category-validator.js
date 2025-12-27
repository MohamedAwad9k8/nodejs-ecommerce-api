import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import { idRules, nameRules } from './validation-rules.js';

// @desc Validator Rules and middleware to get category by id
export const getCategoryByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new category
export const createCategoryValidator = [nameRules(true), validatorMiddleware];

// @desc Validator Rules and middleware to update category by id
export const updateCategoryValidator = [
  idRules(),
  nameRules(false),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete category by id
export const deleteCategoryValidator = [idRules(), validatorMiddleware];
