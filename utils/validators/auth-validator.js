import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import {
  nameRules,
  emailRules,
  passwordRules,
  passwordConfirmRules,
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
