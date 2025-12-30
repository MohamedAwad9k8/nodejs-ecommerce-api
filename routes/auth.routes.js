import express from 'express';
import {
  login,
  signup,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} from '../services/auth.service.js';
import {
  signUpValidator,
  logInValidator,
  forgetPasswordValidator,
  verifyPasswordResetCodeValidator,
  resetPasswordValidator,
} from '../utils/validators/auth-validator.js';

export const AuthRouter = express.Router();

AuthRouter.route('/signup').post(signUpValidator, signup);

AuthRouter.route('/login').post(logInValidator, login);

AuthRouter.route('/forget-password').post(
  forgetPasswordValidator,
  forgetPassword
);

AuthRouter.route('/verify-reset-code').post(
  verifyPasswordResetCodeValidator,
  verifyPasswordResetCode
);

AuthRouter.route('/reset-password').put(resetPasswordValidator, resetPassword);
