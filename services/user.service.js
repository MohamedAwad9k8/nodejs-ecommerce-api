import asyncHandler from 'express-async-handler';
import { resizeImagesForUsers } from '../middlewares/resize-image.middleware.js';
import * as factory from './handlers/handlers-factory.js';
import * as userHandler from './handlers/user-handlers.js';
import { uploadSingleImage } from '../middlewares/upload-image.middleware.js';
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

// @desc Reset User's Password
// @route PUT /api/v1/users/reset-password/:id
// @access Private / Admin
export const resetUserPassword = userHandler.resetUserPassword();
// @desc Deactivate User's Account
// @route DELETE /api/v1/users/deactivate-account/:id
// @access Private / Admin
export const deactivateUserAccount = userHandler.deactivateUserAccount();

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
export const updateLoggedInUserData = userHandler.updateLoggedInUserData();

// @desc Change Logged-in User Password
// @route Put /api/v1/users/change-my-password
// @access Private / Logged-in User
export const changeLoggedUserPassword = userHandler.changeLoggedUserPassword();
