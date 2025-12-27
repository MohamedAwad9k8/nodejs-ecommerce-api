import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { ApiFeatures } from '../utils/api-features.js';

export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(
        new ApiError(`${Model.modelName} not found`, HttpStatusCode.NOT_FOUND)
      );
    }

    res.status(HttpStatusCode.NO_CONTENT).json();
  });

export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`${Model.modelName} not found`, HttpStatusCode.NOT_FOUND)
      );
    }

    res.status(HttpStatusCode.OK).json({
      data: document,
      message: `${Model.modelName} updated successfully`,
    });
  });

export const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(HttpStatusCode.CREATED).json({
      data: newDoc,
      message: `${Model.modelName} created successfully`,
    });
  });

export const getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(`${Model.modelName} not found`, HttpStatusCode.NOT_FOUND)
      );
    }
    res.status(HttpStatusCode.OK).json({ data: document });
  });

export const getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) filter = req.filterObject;
    req.filterObject = filter;

    // Build query
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(Model.modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(HttpStatusCode.OK).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
