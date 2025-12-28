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

export const UserRouter = express.Router();

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
