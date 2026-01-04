import { SubCategoryModel } from '../models/subCategory.model.js';
import * as factory from './handlers/handlers-factory.js';

// Nested Routes Middlewares

// @desc Middleware to set filter object for getSubCategories nested route
// @router Get /api/v1/categories/:categoryId/subcategories
// @access Public
export const setFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

// @desc Middleware to set categoryId to body if not provided, this is useful for create nested route
// @router Post /api/v1/categories/:categoryId/subcategories
// @access Private / Admin - Manager
export const setCategoryIdToBody = (req, res, next) => {
  //nested route categoryId
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// @desc    Get subcategories
// @route   GET /api/v1/subcategories
// @access  Public
export const getSubCategories = factory.getAll(SubCategoryModel);

// @desc Get Specific subcategory
// @route GET /api/v1/subcategories/:id
// @access Public
export const getSubCategoryById = factory.getOne(SubCategoryModel);

// @desc    Create new SubCategory
// @route   POST /api/v1/categories
// @access  Private / Admin - Manager
export const createSubCategory = factory.createOne(SubCategoryModel);

// @desc   Update subcategory by ID
// @route  PUT /api/v1/subcategories/:id
// @access Private / Admin - Manager
export const updateSubCategory = factory.updateOne(SubCategoryModel);

// @desc   Delete subcategory by ID
// @route DELETE /api/v1/subcategories/:id
// @access Private / Admin
export const deleteSubCategory = factory.deleteOne(SubCategoryModel);
