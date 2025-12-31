import bcrypt from 'bcryptjs';
import { check } from 'express-validator';
import { UserModel } from '../../../models/user.model.js';

/**
 * Validator for email field.
 * Validates that the email format.
 * @param {boolean} isRequired - Whether the field is required. Default is true.
 * @param {boolean} isLogin - Whether the validation is for login. Default is false.
 * If false(not login), it checks for email uniqueness in the database.
 */
export const emailRules = (isRequired = true, isLogin = false) => {
  let validator = (
    isRequired
      ? check('email').notEmpty().withMessage('Email is required')
      : check('email').optional()
  )
    .isEmail()
    .withMessage('Invalid email address');

  if (!isLogin) {
    validator = validator.custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already exists'));
        }
      })
    );
  }

  return validator;
};

/**
 * Validator for phone field.
 * Validates that the phone number is a valid mobile phone number based on the specified locales.
 * @param {string[]} locales - An array of locale strings to validate the phone number against.
 * Default is ['ar-EG', 'ar-SA', 'en-US'].
 *
 * [Always Optional Field.]
 */
export const phoneRules = (locales = ['ar-EG', 'ar-SA', 'en-US']) =>
  check('phone')
    .optional()
    .isMobilePhone(locales)
    .withMessage('Invalid phone number');

/** Validator for password field.
 * @param {boolean} isLogin - Whether the validation is for login. Default is false.
 * If true(login), it only checks for non-empty password.
 * If false(not login), it checks for minimum length of 6 characters.
 * @param {string} fieldName - The name of the field to validate. Default is 'password'.
 * Values can be 'password' or 'newPassword'.
 *
 * [Always Mandatory Field.]
 */
export const passwordRules = (isLogin = false, fieldName = 'password') => {
  let validator = check(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`);
  if (!isLogin) {
    validator = validator
      .isLength({ min: 6 })
      .withMessage(`${fieldName} must be at least 6 characters`);
  }
  return validator;
};

/**
 * Validator for password confirmation field.
 * Validates that the password confirmation matches the password.
 * @param {string} fieldName - The name of the field to validate. Default is 'passwordConfirm'.
 * Values can be 'passwordConfirm' or 'newPasswordConfirm'.
 *
 * [Always Mandatory Field.]
 */
export const passwordConfirmRules = (fieldName = 'passwordConfirm') =>
  check(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} confirmation is required`)
    .custom((value, { req }) => {
      const password = req.body.password || req.body.newPassword;
      // verify password confirmation
      if (value !== password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    });

/**
 * Validator for current password field.
 * Validates that the provided current password matches the user's password.
 *
 * [Always Mandatory Field.]
 */
export const currentPasswordRules = () =>
  check('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .custom(async (value, { req }) => {
      // verify user id exists
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error('User not found');
      }
      // verify current password
      const isMatch = await bcrypt.compare(value, user.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }
      return true;
    });

/**
 * Validator for role field.
 * Validates that the role is one of the allowed values: 'user', 'admin', or 'manager'.
 *
 * [Always Optional Field.]
 */
export const roleRules = () =>
  check('role')
    .optional()
    .isIn(['user', 'admin', 'manager'])
    .withMessage('Role must be either user, admin or manager');

/**
 * Validator for reset code field.
 * Validates that the reset code is provided and is 6 characters long.
 *
 * [Always Mandatory Field.]
 */
export const resetCodeRules = () =>
  check('resetCode')
    .notEmpty()
    .withMessage('Reset code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Reset code must be 6 characters long');
