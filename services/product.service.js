import { resizeImagesForProducts } from '../middlewares/resize-image.middleware.js';
import { uploadMixOfImages } from '../middlewares/upload-image.middleware.js';
import * as factory from './handlers/handlers-factory.js';
import { ProductModel } from '../models/product.model.js';

// Middleware to handle mix of images upload into memory (buffer)
export const uploadProductImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

// Middleware to resize of uploaded product images and saving to server
export const resizeProductImages = resizeImagesForProducts;

// @desc    Get products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = factory.getAll(ProductModel);

// @desc Get Specific product
// @route GET /api/v1/products/:id
// @access Public
export const getProductById = factory.getOne(ProductModel);
//still need to set populate for this query, but we will do it through mongoose middleware

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private / Admin - Manager
export const createProduct = factory.createOne(ProductModel);

// @desc   Update product by ID
// @route  PUT /api/v1/products/:id
// @access Private / Admin - Manager
export const updateProduct = factory.updateOne(ProductModel);

// @desc   Delete Product by ID
// @route DELETE /api/v1/products/:id
// @access Private / Admin
export const deleteProduct = factory.deleteOne(ProductModel);
