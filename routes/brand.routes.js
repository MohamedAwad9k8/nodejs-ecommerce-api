import express from 'express';
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} from '../services/brand.service.js';
import {
  getBrandByIdValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} from '../utils/validators/brand-validator.js';

export const BrandRouter = express.Router();

BrandRouter.route('/')
  .get(getBrands)
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);
BrandRouter.route('/:id')
  .get(getBrandByIdValidator, getBrandById)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
