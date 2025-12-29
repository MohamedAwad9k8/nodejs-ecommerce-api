import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

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
