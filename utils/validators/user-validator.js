import { validatorMiddleware } from '../../middlewares/validator.middleware.js';

import {
  emailRules,
  phoneRules,
  passwordRules,
  passwordConfirmRules,
  currentPasswordRules,
  roleRules,
} from './validation-rules/user-validation-rules.js';
import {
  idRules,
  nameTitleRules,
  imageRules,
  optionalBooleanRules,
} from './validation-rules/common-validation-rules.js';

// @desc Validator Rules and middleware to get User by id
export const getUserByIdValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to create a new User
export const createUserValidator = [
  nameTitleRules(true, 'name'),
  emailRules(true, false),
  passwordRules(false, 'password'),
  passwordConfirmRules('passwordConfirm'),
  phoneRules(),
  imageRules(false, 'profileImg'),
  roleRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to update User by id
export const updateUserValidator = [
  idRules(),
  nameTitleRules(false, 'name'),
  emailRules(false, false),
  phoneRules(),
  imageRules(false, 'profileImg'),
  roleRules(),
  optionalBooleanRules('isActive'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to delete User by id
export const deleteUserValidator = [idRules(), validatorMiddleware];

// @desc Validator Rules and middleware to deactivate User account by id
export const deactivateUserAccountValidator = [idRules(), validatorMiddleware];

// Validators for Logged-in User routes

// @desc Validator Rules and middleware to update Logged-in User
export const updateLoggedInUserValidator = [
  nameTitleRules(false, 'name'),
  emailRules(false, false),
  phoneRules(),
  imageRules(false, 'profileImg'),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to change Logged-in User password
export const changeLoggedInUserPasswordValidator = [
  passwordRules(false, 'newPassword'),
  passwordConfirmRules('newPasswordConfirm'),
  currentPasswordRules(),
  validatorMiddleware,
];
