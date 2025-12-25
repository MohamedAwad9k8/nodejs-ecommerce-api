import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { SubCategoryModel } from '../models/subCategory.model.js';

//middleware to set filter object for getSubCategories nested route
export const setFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

// @desc    Get subcategories
// @route   GET /api/v1/subcategories
// @access  Public
export const getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategoryModel.find(req.filterObject)
    .skip(skip)
    .limit(limit);
  res.status(HttpStatusCode.OK).json({
    results: subCategories.length,
    page,
    data: subCategories,
  });
});

// @desc Get Specific subcategory
// @route GET /api/v1/subcategories/:id
// @access Public
export const getSubCategoryById = asyncHandler(async (req, res, next) => {
  const subCategoryId = req.params.id;
  const subCategory = await SubCategoryModel.findById(subCategoryId);
  if (!subCategory) {
    return next(
      new ApiError('SubCategory not found', HttpStatusCode.NOT_FOUND)
    );
  }
  res.status(HttpStatusCode.OK).json({ data: subCategory });
});

// middleware to set categoryId to body if not provided, this is useful for create nested route
export const setCategoryIdToBody = (req, res, next) => {
  //nested route categoryId
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// @desc    Create new SubCategory
// @route   POST /api/v1/categories
// @access  Private
export const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(HttpStatusCode.CREATED).json({
    data: subCategory,
    message: 'SubCategory created successfully',
  });
});

// @desc   Update subcategory by ID
// @route  PUT /api/v1/subcategories/:id
// @access Private
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const subCategoryId = req.params.id;
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    { _id: subCategoryId },
    { name, slug: slugify(name), category },
    { new: true }
  );

  if (!subCategory) {
    return next(
      new ApiError('SubCategory not found', HttpStatusCode.NOT_FOUND)
    );
  }

  res.status(HttpStatusCode.OK).json({
    data: subCategory,
    message: 'SubCategory updated successfully',
  });
});

// @desc   Delete subcategory by ID
// @route DELETE /api/v1/subcategories/:id
// @access Private
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategoryId = req.params.id;

  const subCategory = await SubCategoryModel.findByIdAndDelete(subCategoryId);

  if (!subCategory) {
    return next(
      new ApiError('SubCategory not found', HttpStatusCode.NOT_FOUND)
    );
  }

  res.status(HttpStatusCode.NO_CONTENT).json();
});
