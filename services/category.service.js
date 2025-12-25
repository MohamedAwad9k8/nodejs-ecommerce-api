import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { CategoryModel } from '../models/category.model.js';

// @desc    Get categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(HttpStatusCode.OK).json({
    results: categories.length,
    page,
    data: categories,
  });
});

// @desc Get Specific Category
// @route GET /api/v1/categories/:id
// @access Public
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    return next(new ApiError('Category not found', HttpStatusCode.NOT_FOUND));
  }
  res.status(HttpStatusCode.OK).json({ data: category });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await CategoryModel.create({
    name,
    slug: slugify(name),
  });
  res.status(HttpStatusCode.CREATED).json({
    data: category,
    message: 'Category created successfully',
  });
});

// @desc   Update Category by ID
// @route  PUT /api/v1/categories/:id
// @access Private
export const updateCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  const category = await CategoryModel.findByIdAndUpdate(
    { _id: categoryId },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    return next(new ApiError('Category not found', HttpStatusCode.NOT_FOUND));
  }

  res.status(HttpStatusCode.OK).json({
    data: category,
    message: 'Category updated successfully',
  });
});

// @desc   Delete Category by ID
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await CategoryModel.findByIdAndDelete(categoryId);

  if (!category) {
    return next(new ApiError('Category not found', HttpStatusCode.NOT_FOUND));
  }

  res.status(HttpStatusCode.NO_CONTENT).json();
});
