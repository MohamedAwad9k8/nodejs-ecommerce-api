import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  deactivateUserAccount,
  getLoggedInUserData,
  updateLoggedInUserData,
  changeLoggedUserPassword,
} from '../services/user.service.js';
import {
  getUserByIdValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  deactivateUserAccountValidator,
  updateLoggedInUserValidator,
  changeLoggedInUserPasswordValidator,
} from '../utils/validators/user-validator.js';

import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const UserRouter = express.Router();

// Logged-in User Protected Routes
UserRouter.use(protectRoute);
UserRouter.route('/get-me').get(getLoggedInUserData, getUserById);
UserRouter.route('/deactivate-me').put(
  getLoggedInUserData,
  deactivateUserAccount
);
UserRouter.route('/delete-me').delete(getLoggedInUserData, deleteUser);
UserRouter.route('/update-me').put(
  uploadUserImage,
  resizeImage,
  updateLoggedInUserValidator,
  updateLoggedInUserData
);
UserRouter.route('/change-my-password').put(
  getLoggedInUserData,
  changeLoggedInUserPasswordValidator,
  changeLoggedUserPassword
);

// Admin Protected Routes
UserRouter.use(allowedRoles('admin'));

UserRouter.route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

UserRouter.route('/:id')
  .get(getUserByIdValidator, getUserById)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

UserRouter.route('/change-password/:id').put(
  changeUserPasswordValidator,
  changeUserPassword
);

UserRouter.route('/deactivate-account/:id').put(
  deactivateUserAccountValidator,
  deactivateUserAccount
);
