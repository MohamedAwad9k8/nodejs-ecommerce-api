import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import { idRules, nameRules } from './validation-rules.js';

// @desc Validator Rules and middleware to get Brand by id
export const getBrandByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new Brand
export const createBrandValidator = [nameRules(true), validatorMiddleware];

// @desc Validator Rules and middleware to update Brand by id
export const updateBrandValidator = [
  idRules(),
  nameRules(false),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete Brand by id
export const deleteBrandValidator = [idRules(), validatorMiddleware];
