import crypto from 'crypto';

import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { sendEmail } from '../utils/validators/send-email.js';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { UserModel } from '../models/user.model.js';

// Generate Dummy Hash Password to Mitigate Timing Attacks
const generateDummyHash = async () =>
  await bcrypt.hash('this-is-a-dummy-password', 12);

// Generate JWT Token
const generateToken = (payload) =>
  jsonwebtoken.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// @desc Signup New User
// @route POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2- generate token
  const token = generateToken(user._id);
  // 3- send response to client side
  res.status(HttpStatusCode.CREATED).json({
    data: user,
    token,
  });
});

// @desc Login User
// @route POST /api/v1/auth/login
// @access Public
export const login = asyncHandler(async (req, res, next) => {
  const dummyHash = await generateDummyHash();
  // 1) Check if user exists
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    await bcrypt.compare(req.body.password, dummyHash); // to mitigate timing attack
    return next(
      new ApiError('Incorrect email or password', HttpStatusCode.UNAUTHORIZED)
    );
  }
  // 2) Check password matches
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return next(
      new ApiError('Incorrect email or password', HttpStatusCode.UNAUTHORIZED)
    );
  }
  // 2) If everything is ok, Generate token
  const token = generateToken(user._id);
  // 3) Send response to client side
  res.status(HttpStatusCode.OK).json({
    data: user,
    token,
  });
});

// @desc Protect Routes Middleware
// Makes sure the user is logged in before accessing protected routes
export const protectRoute = asyncHandler(async (req, res, next) => {
  // 1) Check if token exists

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'You are not logged in! Please log in to get access this route.',
        HttpStatusCode.UNAUTHORIZED
      )
    );
  }

  // 2) Verify token (valid [not expired, not tempered with])
  const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if user exists
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user belonging to this token does no longer exist.',
        HttpStatusCode.UNAUTHORIZED
      )
    );
  }

  // 4) check if user changed password after token was issued (token shouldn't be valid anymore)
  if (currentUser.passwordChangedAt) {
    const passwordChangedAtTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedAtTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed password! Please log in again.',
          HttpStatusCode.UNAUTHORIZED
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

// @desc Restrict To Middleware
// Allows access to specific user roles only
export const allowedRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) Access Allowed Roles (parameters before asyncHandler)
    // 2) Access Registered User (req.user)
    // 3) Check if user role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          'You do not have permission to perform this action',
          HttpStatusCode.FORBIDDEN
        )
      );
    }
    next();
  });

// @desc Forget Password
// @route POST /api/v1/auth/forget-password
// @access Public
export const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(
        `No account for this email: ${req.body.email}`,
        HttpStatusCode.NOT_FOUND
      )
    );
  }
  // 2) Generate a random reset token, hash it and save it to the db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed Code to the DB
  user.passwordResetCode = hashedResetCode;
  // Set code expiration time for the reset code (10 minutes)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  // 3) Send the reset code to the user's email
  const message =
    `Hi ${user.name},\n` +
    'We recieved your request to rest password on your e-commerce account.\n' +
    `Your password reset code is: ${resetCode} \n` +
    'Please note the reset code is valid for 10 minutes.';

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Code',
      message,
    });
  } catch (error) {
    // In case of error, clear the reset code fields
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError(
        'There was an error sending the email. Try again later.',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    );
  }
  // 4) Send success response to client side
  res.status(HttpStatusCode.OK).json({
    status: 'success',
    message: 'Reset code sent to email!',
  });
});

// @desc Verify Password Reset Code
// @route POST /api/v1/auth/verify-reset-code
// @access Public
export const verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  //1) Get user based on the reset code
  // Hash the reset code sent by the user
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  // Find user with the hashed reset code and check if the code has not expired
  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log(req.body.resetCode);
  console.log(hashedResetCode);
  console.log(user);
  if (!user) {
    return next(
      new ApiError('Invalid or expired reset code', HttpStatusCode.BAD_REQUEST)
    );
  }
  // 2) Reset code is valid, verify the code
  user.passwordResetVerified = true;
  await user.save();
  // 3) Send success response to client side
  res.status(HttpStatusCode.OK).json({
    status: 'success',
  });
});

// @desc Reset Password
// @route POST /api/v1/auth/reset-password
// @access Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(
        `No account for this email: ${req.body.email}`,
        HttpStatusCode.NOT_FOUND
      )
    );
  }
  // 2) Check if the reset code is verified
  if (!user.passwordResetVerified) {
    return next(
      new ApiError('Reset code not verified', HttpStatusCode.BAD_REQUEST)
    );
  }
  // 3) Reset the password and clear the reset code fields
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetVerified = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // 4) Generate JWT token
  const token = generateToken(user._id);

  // 5) Send response to client side
  res.status(HttpStatusCode.OK).json({
    message: 'Password reset successfully',
    token,
  });
});
