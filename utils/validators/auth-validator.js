import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import {
  nameRules,
  emailRules,
  passwordRules,
  passwordConfirmRules,
  resetCodeRules,
} from './validation-rules.js';

// @desc Validator Rules and middleware to create a new User
export const signUpValidator = [
  nameRules(),
  emailRules(),
  passwordRules(),
  passwordConfirmRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to create a new User
export const logInValidator = [
  emailRules(true, true),
  passwordRules(true),
  validatorMiddleware,
];

// @desc Validator Rules and middleware for forget password route
export const forgetPasswordValidator = [
  emailRules(true, true),
  validatorMiddleware,
];

// @desc Validator Rules and middleware for verify password reset code route
export const verifyPasswordResetCodeValidator = [
  resetCodeRules(),
  validatorMiddleware,
];

// @desc Validator Rules and middleware to reset password
export const resetPasswordValidator = [
  emailRules(true, true),
  passwordRules(true, 'newPassword'),
  passwordConfirmRules('newPasswordConfirm'),
  validatorMiddleware,
];
