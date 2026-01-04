import * as factory from './handlers/handlers-factory.js';
import { ReviewModel } from '../models/review.model.js';

// Nested Routes Middlewares

// @desc Middleware to set filter object for Get All Reviews and Get One Review nested routes
// @route Get /api/v1/products/:productId/reviews
// @route Get /api/v1/products/:productId/reviews/:id
// @access Public
export const setFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObject = filterObject;
  next();
};

// @desc Middleware to set productId to body if not provided, this is useful for create nested route
// @router Post /api/v1/products/:productId/reviews
// @access Private / protected / User
export const setProductIdToBody = (req, res, next) => {
  //nested route productId
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  next();
};

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = factory.getAll(ReviewModel);

// @desc Get Specific review
// @route GET /api/v1/reviews/:id
// @access Public
export const getReviewById = factory.getOne(ReviewModel);

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private / Protected / User
export const createReview = factory.createOne(ReviewModel);

// @desc   Update review by ID
// @route  PUT /api/v1/reviews/:id
// @access Private / Protected / User
export const updateReview = factory.updateOne(ReviewModel);

// @desc   Delete review by ID
// @route DELETE /api/v1/reviews/:id
// @access Private / Protected / User - Admin - Manager
export const deleteReview = factory.deleteOne(ReviewModel);
