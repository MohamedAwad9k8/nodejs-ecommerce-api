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
//import { SubCategoryRouter } from './subCategory.routes.js';

export const ProductRouter = express.Router();

// Mount SubCategoryRouter on /:categoryId/categories (Nested Route)
//CategoryRouter.use('/:categoryId/subcategories', SubCategoryRouter);

ProductRouter.route('/')
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
ProductRouter.route('/:id')
  .get(getProductByIdValidator, getProductById)
  .put(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);
