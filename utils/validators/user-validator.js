import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import {
  idRules,
  nameRules,
  emailRules,
  phoneRules,
  passwordRules,
  passwordConfirmRules,
  currentPasswordRules,
  profileImgRules,
  roleRules,
  isActiveRules,
} from './validation-rules.js';

// @desc Validator Rules and middleware to get User by id
export const getUserByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new User
export const createUserValidator = [
  nameRules(),
  emailRules(),
  passwordRules(),
  passwordConfirmRules(),
  phoneRules(),
  profileImgRules(),
  roleRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update User by id
export const updateUserValidator = [
  idRules(),
  nameRules(false),
  emailRules(false),
  phoneRules(),
  profileImgRules(),
  roleRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete User by id
export const deleteUserValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to change User password by id
export const changeUserPasswordValidator = [
  idRules(),
  passwordRules(),
  passwordConfirmRules(),
  currentPasswordRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to deactivate User account by id
export const deactivateUserAccountValidator = [
  idRules(),
  isActiveRules(),
  validatorMiddleware,
];

// Validators for Logged-in User routes

// @desc Validator Rules and middleware to update Logged-in User
export const updateLoggedInUserValidator = [
  nameRules(false),
  emailRules(false),
  phoneRules(),
  profileImgRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to change Logged-in User password
export const changeLoggedInUserPasswordValidator = [
  passwordRules(),
  passwordConfirmRules(),
  currentPasswordRules(),
  validatorMiddleware,
];
