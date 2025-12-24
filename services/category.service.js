import { CategoryModel } from "../models/category.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";

// @desc    Get categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc Get Specific Category
// @route GET /api/v1/categories/:id
// @access Public
export const getCategoryById = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    res.status(404).jsion({ message: "Category not found" });
  }
  res.status(200).json({ data: category });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res
    .status(201)
    .json({ data: category, message: "Category created successfully" });
});

// @desc   Update Category by ID
// @route  PUT /api/v1/categories/:id
// @access Private
export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  const category = await CategoryModel.findByIdAndUpdate(
    { _id: categoryId },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    res.status(404).json({ message: "Category not found" });
  }

  res
    .status(200)
    .json({ data: category, message: "Category updated successfully" });
});

// @desc   Delete Category by ID
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  const category = await CategoryModel.findByIdAndDelete(categoryId);

  if (!category) {
    res.status(404).json({ message: "Category not found" });
  }

  res.status(204).json();
});
