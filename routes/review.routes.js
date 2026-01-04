import express from 'express';
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  setFilterObject,
  setProductIdToBody,
} from '../services/review.service.js';
import {
  getReviewByIdValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} from '../utils/validators/review-validator.js';
import { protectRoute, allowedRoles } from '../services/auth.service.js';

// Merge params to access ProductId from parent router
export const ReviewRouter = express.Router({ mergeParams: true });

ReviewRouter.route('/')
  .get(setFilterObject, getReviews)
  .post(
    protectRoute,
    allowedRoles('user'),
    setProductIdToBody,
    createReviewValidator,
    createReview
  );
ReviewRouter.route('/:id')
  .get(setFilterObject, getReviewByIdValidator, getReviewById)
  .put(protectRoute, allowedRoles('user'), updateReviewValidator, updateReview)
  .delete(
    protectRoute,
    allowedRoles('admin', 'manager', 'user'),
    deleteReviewValidator,
    deleteReview
  );
