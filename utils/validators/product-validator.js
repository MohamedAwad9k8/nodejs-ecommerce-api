import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import {
  titleRules,
  descriptionRules,
  quantityRules,
  soldRules,
  priceRules,
  priceAfterDiscountRules,
  colorsRules,
  imageCoverRules,
  imagesRules,
  categoryRules,
  subcategoryRules,
  brandRules,
  ratingsAverageRules,
  ratingsQuantityRules,
  idRules,
} from './validation-rules.js';

// @desc Validator Rules and middleware to get Product by id
export const getProductByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new Product
export const createProductValidator = [
  titleRules(true),
  descriptionRules(true),
  quantityRules(true),
  soldRules(false),
  priceRules(true),
  priceAfterDiscountRules(),
  colorsRules(),
  imageCoverRules(true),
  imagesRules(),
  categoryRules(true),
  subcategoryRules(),
  brandRules(),
  ratingsAverageRules(),
  ratingsQuantityRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update Product by id
export const updateProductValidator = [
  idRules(),
  titleRules(false),
  descriptionRules(false),
  quantityRules(false),
  soldRules(false),
  priceRules(false),
  priceAfterDiscountRules(),
  colorsRules(),
  imageCoverRules(false),
  imagesRules(),
  categoryRules(false),
  subcategoryRules(),
  brandRules(),
  ratingsAverageRules(),
  ratingsQuantityRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete Product by id
export const deleteProductValidator = [idRules(), validatorMiddleware];
