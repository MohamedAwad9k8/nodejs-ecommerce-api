import * as authHandler from './auth-handlers.js';
import * as resetPasswordHandler from './reset-password-handlers.js';

// @desc Signup New User
// @route POST /api/v1/auth/signup
// @access Public
export const signup = authHandler.signup();

// @desc Login User
// @route POST /api/v1/auth/login
// @access Public
export const login = authHandler.login();

// @desc Protect Routes Middleware
// Makes sure the user is logged in before accessing protected routes
export const protectRoute = authHandler.protectRoute();

// @desc Restrict To Middleware
// Allows access to specific user roles only
export const allowedRoles = authHandler.allowedRoles;

// @desc Forget Password
// @route POST /api/v1/auth/forget-password
// @access Public
export const forgetPassword = resetPasswordHandler.forgetPassword();

// @desc Verify Password Reset Code
// @route POST /api/v1/auth/verify-reset-code
// @access Public
export const verifyPasswordResetCode =
  resetPasswordHandler.verifyPasswordResetCode();

// @desc Reset Password
// @route POST /api/v1/auth/reset-password
// @access Public
export const resetPassword = resetPasswordHandler.resetPassword();
