import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { ProductModel } from '../models/product.model.js';

// @desc    Get products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const products = await ProductModel.find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: 'category', select: 'name' });
  res.status(HttpStatusCode.OK).json({
    results: products.length,
    page,
    data: products,
  });
});

// @desc Get Specific product
// @route GET /api/v1/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId).populate({
    path: 'category',
    select: 'name',
  });
  if (!product) {
    return next(new ApiError('Product not found', HttpStatusCode.NOT_FOUND));
  }
  res.status(HttpStatusCode.OK).json({ data: product });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private
export const createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const product = await ProductModel.create(req.body);
  res.status(HttpStatusCode.CREATED).json({
    data: product,
    message: 'Product created successfully',
  });
});

// @desc   Update product by ID
// @route  PUT /api/v1/products/:id
// @access Private
export const updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await ProductModel.findByIdAndUpdate(
    { _id: productId },
    req.body,
    { new: true }
  );

  if (!product) {
    return next(new ApiError('product not found', HttpStatusCode.NOT_FOUND));
  }

  res.status(HttpStatusCode.OK).json({
    data: product,
    message: 'Product updated successfully',
  });
});

// @desc   Delete Product by ID
// @route DELETE /api/v1/products/:id
// @access Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  const product = await ProductModel.findByIdAndDelete(productId);

  if (!product) {
    return next(new ApiError('Product not found', HttpStatusCode.NOT_FOUND));
  }

  res.status(HttpStatusCode.NO_CONTENT).json();
});
