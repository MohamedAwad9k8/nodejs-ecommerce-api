import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  resetUserPassword,
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
  deactivateUserAccountValidator,
  updateLoggedInUserValidator,
  changeLoggedInUserPasswordValidator,
} from '../utils/validators/user-validator.js';

import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const UserRouter = express.Router();
export const AdminRouter = express.Router();

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
AdminRouter.use(protectRoute, allowedRoles('admin'));

AdminRouter.route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

AdminRouter.route('/:id')
  .get(getUserByIdValidator, getUserById)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

AdminRouter.route('/reset-password/:id').put(resetUserPassword);

AdminRouter.route('/deactivate-account/:id').put(
  deactivateUserAccountValidator,
  deactivateUserAccount
);
