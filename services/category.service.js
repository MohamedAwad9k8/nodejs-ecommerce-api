import multer from 'multer';
import sharp from 'sharp';
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { CategoryModel } from '../models/category.model.js';
import * as factory from './handlers-factory.js';
import { ApiError, HttpStatusCode } from '../utils/api-error.js';

// Disk Storage Configuration for Multer
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/categories');
//   },
//   filename: function (req, file, cb) {
//     // Unique Naming Convention: CategoryName-$id-$timestamp-extension
//     const ext = file.mimetype.split('/')[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });

// Memory Storage Configuration for Multer to process images before saving using Sharp
const multerStorage = multer.memoryStorage();

// File Filter to allow only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Only Images Allowed.', HttpStatusCode.BAD_REQUEST), false);
  }
};

// Configure multer for file uploads
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  // Save image filename to DB
  req.body.image = fileName;
  next();
});

export const uploadCategoryImage = upload.single('image');
// @desc    Get categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = factory.getAll(CategoryModel);

// @desc Get Specific Category
// @route GET /api/v1/categories/:id
// @access Public
export const getCategoryById = factory.getOne(CategoryModel);

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = factory.createOne(CategoryModel);

// @desc   Update Category by ID
// @route  PUT /api/v1/categories/:id
// @access Private
export const updateCategory = factory.updateOne(CategoryModel);

// @desc   Delete Category by ID
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = factory.deleteOne(CategoryModel);
