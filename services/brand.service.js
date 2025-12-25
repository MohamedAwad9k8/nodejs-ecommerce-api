import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { BrandModel } from '../models/brand.model.js';

// @desc    Get brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await BrandModel.find({}).skip(skip).limit(limit);
  res.status(HttpStatusCode.OK).json({
    results: brands.length,
    page,
    data: brands,
  });
});

// @desc Get Specific brand
// @route GET /api/v1/brands/:id
// @access Public
export const getBrandById = asyncHandler(async (req, res, next) => {
  const brandId = req.params.id;
  const brand = await BrandModel.findById(brandId);
  if (!brand) {
    return next(new ApiError('Brand not found', HttpStatusCode.NOT_FOUND));
  }
  res.status(HttpStatusCode.OK).json({ data: brand });
});

// @desc    Create new brand
// @route   POST /api/v1/brands
// @access  Private
export const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await BrandModel.create({
    name,
    slug: slugify(name),
  });
  res.status(HttpStatusCode.CREATED).json({
    data: brand,
    message: 'Brand created successfully',
  });
});

// @desc   Update Brand by ID
// @route  PUT /api/v1/brands/:id
// @access Private
export const updateBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.params.id;
  const { name } = req.body;

  const brand = await BrandModel.findByIdAndUpdate(
    { _id: brandId },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!brand) {
    return next(new ApiError('Brand not found', HttpStatusCode.NOT_FOUND));
  }

  res.status(HttpStatusCode.OK).json({
    data: brand,
    message: 'Brand updated successfully',
  });
});

// @desc   Delete Brand by ID
// @route DELETE /api/v1/brands/:id
// @access Private
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.params.id;

  const brand = await BrandModel.findByIdAndDelete(brandId);

  if (!brand) {
    return next(new ApiError('Brand not found', HttpStatusCode.NOT_FOUND));
  }

  res.status(HttpStatusCode.NO_CONTENT).json();
});
