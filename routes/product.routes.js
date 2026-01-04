import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} from '../services/product.service.js';
import {
  getProductByIdValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from '../utils/validators/product-validator.js';
import { protectRoute, allowedRoles } from '../services/auth.service.js';
import { ReviewRouter } from './review.routes.js';

export const ProductRouter = express.Router();

// Mount ReviewRouter on /:productId/reviews (Nested Route)
ProductRouter.use('/:productId/reviews', ReviewRouter);

ProductRouter.route('/')
  .get(getProducts)
  .post(
    protectRoute,
    allowedRoles('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
ProductRouter.route('/:id')
  .get(getProductByIdValidator, getProductById)
  .put(
    protectRoute,
    allowedRoles('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    protectRoute,
    allowedRoles('admin'),
    deleteProductValidator,
    deleteProduct
  );
