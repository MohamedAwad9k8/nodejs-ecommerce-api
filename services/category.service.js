import { resizeImagesForCategories } from '../middlewares/resize-image.middleware.js';
import * as factory from './handlers-factory.js';
import { uploadSingleImage } from '../middlewares/upload-image.middleware.js';
import { CategoryModel } from '../models/category.model.js';

// Middleware to handle single image upload into memory (buffer)
export const uploadCategoryImage = uploadSingleImage('image');

// Middleware to resize of uploaded category image and saving to server
export const resizeImage = resizeImagesForCategories;

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
