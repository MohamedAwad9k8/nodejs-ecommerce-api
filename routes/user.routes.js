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
} from '../services/user.service.js';
import {
  getUserByIdValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  deactivateUserAccountValidator,
} from '../utils/validators/user-validator.js';

import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const UserRouter = express.Router();

UserRouter.route('/')
  .get(protectRoute, allowedRoles('admin'), getUsers)
  .post(
    protectRoute,
    allowedRoles('admin'),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
UserRouter.route('/:id')
  .get(protectRoute, allowedRoles('admin'), getUserByIdValidator, getUserById)
  .put(
    protectRoute,
    allowedRoles('admin'),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(protectRoute, allowedRoles('admin'), deleteUserValidator, deleteUser);

UserRouter.route('/change-password/:id').put(
  protectRoute,
  allowedRoles('admin'),
  changeUserPasswordValidator,
  changeUserPassword
);

UserRouter.route('/deactivate-account/:id').put(
  protectRoute,
  allowedRoles('admin'),
  deactivateUserAccountValidator,
  deactivateUserAccount
);
