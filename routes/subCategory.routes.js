import express from 'express';
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  setFilterObject,
} from '../services/subCategory.service.js';
import {
  createSubCategoryValidator,
  getSubCategoryByIdValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} from '../utils/validators/subCategory-validator.js';
import { protectRoute, allowedRoles } from '../services/auth.service.js';
// Merge params to access categoryId from parent router
export const SubCategoryRouter = express.Router({ mergeParams: true });

SubCategoryRouter.route('/')
  .post(
    protectRoute,
    allowedRoles('admin', 'manager'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(setFilterObject, getSubCategories);

SubCategoryRouter.route('/:id')
  .get(getSubCategoryByIdValidator, getSubCategoryById)
  .put(
    protectRoute,
    allowedRoles('admin', 'manager'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protectRoute,
    allowedRoles('admin'),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
