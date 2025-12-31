import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import { categoryRules } from './validation-rules/products-validation-rules.js';
import {
  idRules,
  nameTitleRules,
} from './validation-rules/common-validation-rules.js';

// @desc Validator Rules and middleware to get Subcategory by id
export const getSubCategoryByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new Subcategory
export const createSubCategoryValidator = [
  nameTitleRules(true, 'name'),
  categoryRules(true),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update Subcategory by id
export const updateSubCategoryValidator = [
  idRules(),
  nameTitleRules(false, 'name'),
  categoryRules(false),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete Subcategory by id
export const deleteSubCategoryValidator = [idRules(), validatorMiddleware];
