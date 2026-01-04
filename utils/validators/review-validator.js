import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import {
  idRules,
  nameTitleRules,
  ratingsRules,
  removeField,
} from './validation-rules/common-validation-rules.js';
import {
  userRules,
  productRules,
  reviewIdUpdateRules,
  reviewIdDeleteRules,
} from './validation-rules/reviews-validation-rules.js';
import {} from './validation-rules/products-validation-rules.js';

// @desc Validator Rules and middleware to get Review by id
export const getReviewByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new Review
export const createReviewValidator = [
  nameTitleRules(false, 'title'),
  ratingsRules(true, 'rating'),
  userRules(),
  productRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update Review by id
export const updateReviewValidator = [
  idRules(),
  reviewIdUpdateRules(),
  nameTitleRules(false, 'title'),
  ratingsRules(false, 'rating'),
  removeField('product'),
  removeField('user'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete Review by id
export const deleteReviewValidator = [
  idRules(),
  reviewIdDeleteRules(),
  validatorMiddleware,
];
