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

// Merge params to access categoryId from parent router
export const SubCategoryRouter = express.Router({ mergeParams: true });

SubCategoryRouter.route('/')
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(setFilterObject, getSubCategories);

SubCategoryRouter.route('/:id')
  .get(getSubCategoryByIdValidator, getSubCategoryById)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
