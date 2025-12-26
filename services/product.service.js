import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { ProductModel } from '../models/product.model.js';

// @desc    Get products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  // 1) Filtering
  const queryStringObject = { ...req.query };
  const excludeFields = ['page', 'limit', 'sort', 'fields', 'keyword'];
  excludeFields.forEach((field) => delete queryStringObject[field]);
  // Apply Filtering for gt, gte, lt, lte, in
  let queryString = JSON.stringify(queryStringObject);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  const queryStringObjectFinal = JSON.parse(queryString);

  // 2) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  // Build query
  let mongooseQuery = ProductModel.find(queryStringObjectFinal)
    .skip(skip)
    .limit(limit)
    .populate({ path: 'category', select: 'name' });

  // 3) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort('-createdAt');
  }

  // 4) Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select('-__v');
  }

  // 5) Search
  if (req.query.keyword) {
    const { keyword } = req.query;
    const query = {};
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
    mongooseQuery = mongooseQuery.find(query);
  }

  // Execute query
  const products = await mongooseQuery;

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
