import { CategoryModel } from '../models/category.model.js';
import * as factory from './handlers-factory.js';

// @desc    Get categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = factory.getAll(CategoryModel);

// @desc Get Specific Category
// @route GET /api/v1/categories/:id
// @access Public
export const getCategoryById = factory.getOne(CategoryModel);

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = factory.createOne(CategoryModel);

// @desc   Update Category by ID
// @route  PUT /api/v1/categories/:id
// @access Private
export const updateCategory = factory.updateOne(CategoryModel);

// @desc   Delete Category by ID
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = factory.deleteOne(CategoryModel);
