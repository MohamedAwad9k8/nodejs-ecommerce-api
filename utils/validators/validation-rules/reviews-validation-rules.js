import { check } from 'express-validator';
import { ReviewModel } from '../../../models/review.model.js';

/**
 * Sanitizer for user field.
 * Sets the user field to the ID of the currently logged-in user.
 * [Always Mandatory Field.]
 */
export const userRules = () =>
  check('user').customSanitizer((value, { req }) => req.user._id.toString());

/**
 * Validator for product field.
 * Validates the product ID format.
 * Validates that the user has not already reviewed the product.
 * [Always Mandatory Field.]
 */
export const productRules = () =>
  check('product')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom((value, { req }) =>
      // check if logged in user has already reviewed the product
      ReviewModel.findOne({
        user: req.user._id,
        product: value,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error('You have already reviewed this product')
          );
        }
      })
    );

/**
 * Validator for review ID in update requests.
 * Ensures that the review being updated belongs to the logged-in user.
 */
export const reviewIdUpdateRules = () =>
  check('id').custom((reviewId, { req }) =>
    // check if the review belongs to the logged in user
    ReviewModel.findById(reviewId).then((review) => {
      if (!review) {
        return Promise.reject(new Error('Review not found'));
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error('You are not allowed to update this review')
        );
      }
    })
  );

/**
 * Validator for review ID in delete requests.
 * Ensures that if the user role is 'user', they can only delete their own reviews.
 * Admins and managers can delete any review.
 */
export const reviewIdDeleteRules = () =>
  check('id').custom((reviewId, { req }) => {
    if (req.user.role === 'user') {
      // check if the review belongs to the logged in user
      return ReviewModel.findById(reviewId).then((review) => {
        if (!review) {
          return Promise.reject(new Error('Review not found'));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error('You are not allowed to delete this review')
          );
        }
        return true;
      });
    }
    return true;
  });
