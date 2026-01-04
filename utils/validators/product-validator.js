import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import {
  priceRules,
  priceAfterDiscountRules,
  categoryRules,
  subcategoryRules,
  brandRules,
} from './validation-rules/products-validation-rules.js';
import {
  idRules,
  nameTitleRules,
  imageRules,
  optionalArrayRules,
  descriptionRules,
  quantityRules,
  ratingsRules,
} from './validation-rules/common-validation-rules.js';
// @desc Validator Rules and middleware to get Product by id
export const getProductByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new Product
export const createProductValidator = [
  nameTitleRules(true, 'title'),
  descriptionRules(true),
  quantityRules(true, 'quantity'),
  quantityRules(false, 'sold'),
  priceRules(true),
  priceAfterDiscountRules(),
  optionalArrayRules('colors'),
  imageRules(true, 'imageCover'),
  optionalArrayRules('images'),
  categoryRules(true),
  subcategoryRules(),
  brandRules(),
  ratingsRules(false, 'ratingsAverage'),
  quantityRules(false, 'ratingsQuantity'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update Product by id
export const updateProductValidator = [
  idRules(),
  nameTitleRules(false, 'title'),
  descriptionRules(false),
  quantityRules(false, 'quantity'),
  quantityRules(false, 'sold'),
  priceRules(false),
  priceAfterDiscountRules(),
  optionalArrayRules('colors'),
  imageRules(false, 'imageCover'),
  optionalArrayRules('images'),
  categoryRules(false),
  subcategoryRules(),
  brandRules(),
  ratingsRules(false, 'ratingsAverage'),
  quantityRules(false, 'ratingsQuantity'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete Product by id
export const deleteProductValidator = [idRules(), validatorMiddleware];
