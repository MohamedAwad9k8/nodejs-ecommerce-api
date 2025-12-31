import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

import { resizeImagesForUsers } from '../middlewares/resize-image.middleware.js';
import * as factory from './handlers-factory.js';
import { uploadSingleImage } from '../middlewares/upload-image.middleware.js';
import { generateJWTToken } from '../utils/crypto-functions.js';
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
  const user = await UserModel.findByIdAndUpdate(
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

  if (!user) {
    return next(new ApiError(`user not found`, HttpStatusCode.NOT_FOUND));
  }

  res.status(HttpStatusCode.OK).json({
    data: user,
    message: `user updated successfully`,
  });
});

// @desc Deactivate User's Account
// @route DELETE /api/v1/users/deactivate-account/:id
// @access Private / Admin
export const deactivateUserAccount = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    // update isActive field only
    { isActive: false },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`user not found`, HttpStatusCode.NOT_FOUND));
  }

  res.status(HttpStatusCode.OK).json({
    data: user,
    message: `account deactivated`,
  });
});

// @desc Takes user id from request body and add it in request params, allows chaining other existing handlers
// @route Get /api/v1/users/get-me
// @route Put /api/v1/users/deactivate-me
// @route Delete /api/v1/users/delete-me
// @access Private / Logged-in User
export const getLoggedInUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc Update Logged-in User Data (User can only update name, email, phone, profileImg)
// @route Put /api/v1/users/update-me
// @access Private / Logged-in User
export const updateLoggedInUserData = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );

  res.status(HttpStatusCode.OK).json({
    data: user,
    message: `user updated successfully`,
  });
});

// @desc Change Logged-in User Password
// @route Put /api/v1/users/change-my-password
// @access Private / Logged-in User
export const changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    // update password field only
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`user not found`, HttpStatusCode.NOT_FOUND));
  }

  // Generate New JWT token for user, as the old one is invalid after password change
  const token = generateJWTToken(user._id);

  res.status(HttpStatusCode.OK).json({
    data: user,
    message: `user password updated successfully`,
    token,
  });
});
