import { BrandModel } from '../models/brand.model.js';
import * as factory from './handlers-factory.js';

// @desc    Get brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = factory.getAll(BrandModel);

// @desc Get Specific brand
// @route GET /api/v1/brands/:id
// @access Public
export const getBrandById = factory.getOne(BrandModel);

// @desc    Create new brand
// @route   POST /api/v1/brands
// @access  Private
export const createBrand = factory.createOne(BrandModel);

// @desc   Update Brand by ID
// @route  PUT /api/v1/brands/:id
// @access Private
export const updateBrand = factory.updateOne(BrandModel);

// @desc   Delete Brand by ID
// @route DELETE /api/v1/brands/:id
// @access Private
export const deleteBrand = factory.deleteOne(BrandModel);
