import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} from '../services/category.service.js';
import {
  getCategoryByIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from '../utils/validators/category-validator.js';
import { SubCategoryRouter } from './subCategory.routes.js';
import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const CategoryRouter = express.Router();

// Mount SubCategoryRouter on /:categoryId/categories (Nested Route)
CategoryRouter.use('/:categoryId/subcategories', SubCategoryRouter);

CategoryRouter.route('/')
  .get(getCategories)
  .post(
    protectRoute,
    allowedRoles('admin', 'manager'),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
CategoryRouter.route('/:id')
  .get(getCategoryByIdValidator, getCategoryById)
  .put(
    protectRoute,
    allowedRoles('admin', 'manager'),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protectRoute,
    allowedRoles('admin'),
    deleteCategoryValidator,
    deleteCategory
  );
