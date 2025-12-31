import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import {
  idRules,
  nameTitleRules,
  imageRules,
} from './validation-rules/common-validation-rules.js';

// @desc Validator Rules and middleware to get Brand by id
export const getBrandByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new Brand
export const createBrandValidator = [
  nameTitleRules(true, 'name'),
  imageRules(true, 'image'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update Brand by id
export const updateBrandValidator = [
  idRules(),
  nameTitleRules(false, 'name'),
  imageRules(false, 'image'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete Brand by id
export const deleteBrandValidator = [idRules(), validatorMiddleware];
