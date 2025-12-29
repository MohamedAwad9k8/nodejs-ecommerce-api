import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

import { resizeImagesForUsers } from '../middlewares/resize-image.middleware.js';
import * as factory from './handlers-factory.js';
import { uploadSingleImage } from '../middlewares/upload-image.middleware.js';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { UserModel } from '../models/user.model.js';

// Middleware to handle single image upload into memory (buffer)
export const uploadUserImage = uploadSingleImage('profileImg');

// Middleware to resize of uploaded brand image and saving to server
export const resizeImage = resizeImagesForUsers;

// @desc    Get Users
// @route   GET /api/v1/users
// @access  Private / Admin
export const getUsers = factory.getAll(UserModel);

// @desc Get Specific User
// @route GET /api/v1/users/:id
// @access Private / Admin
export const getUserById = factory.getOne(UserModel);

// @desc    Create new User
// @route   POST /api/v1/users
// @access  Private / Admin
export const createUser = factory.createOne(UserModel);

// @desc   Update User by ID
// @route  PUT /api/v1/users/:id
// @access Private / Admin
export const updateUser = factory.updateOne(UserModel);

// @desc   Delete User by ID
// @route DELETE /api/v1/users/:id
// @access Private / Admin
export const deleteUser = factory.deleteOne(UserModel);

// @desc Change User's Password
// @route PUT /api/v1/users/change-password/:id
// @access Private / Admin
export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    // update password field only
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(
      new ApiError(`${UserModel.modelName} not found`, HttpStatusCode.NOT_FOUND)
    );
  }

  res.status(HttpStatusCode.OK).json({
    data: document,
    message: `${UserModel.modelName} updated successfully`,
  });
});

// @desc Deactivate User's Account
// @route DELETE /api/v1/users/deactivate-account/:id
// @access Private / Admin
export const deactivateUserAccount = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    // update isActive field only
    { isActive: false },
    {
      new: true,
    }
  );

  if (!document) {
    return next(
      new ApiError(`${UserModel.modelName} not found`, HttpStatusCode.NOT_FOUND)
    );
  }

  res.status(HttpStatusCode.OK).json({
    data: document,
    message: `${UserModel.modelName} updated successfully`,
  });
});
