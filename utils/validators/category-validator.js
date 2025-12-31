import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import {
  idRules,
  nameTitleRules,
  imageRules,
} from './validation-rules/common-validation-rules.js';

// @desc Validator Rules and middleware to get category by id
export const getCategoryByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new category
export const createCategoryValidator = [
  nameTitleRules(true, 'name'),
  imageRules(true, 'image'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update category by id
export const updateCategoryValidator = [
  idRules(),
  nameTitleRules(false, 'name'),
  imageRules(false, 'image'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete category by id
export const deleteCategoryValidator = [idRules(), validatorMiddleware];
