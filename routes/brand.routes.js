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
import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const BrandRouter = express.Router();

BrandRouter.route('/')
  .get(getBrands)
  .post(
    protectRoute,
    allowedRoles('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
BrandRouter.route('/:id')
  .get(getBrandByIdValidator, getBrandById)
  .put(
    protectRoute,
    allowedRoles('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    protectRoute,
    allowedRoles('admin'),
    deleteBrandValidator,
    deleteBrand
  );
