import bcrypt from 'bcryptjs';

import asyncHandler from 'express-async-handler';

import {
  generateJWTToken,
  verifyJWTToken,
  generateDummyHash,
} from '../utils/crypto-functions.js';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { UserModel } from '../models/user.model.js';

export const login = () =>
  asyncHandler(async (req, res, next) => {
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
    const token = generateJWTToken(user._id);
    // 3) Send response to client side
    res.status(HttpStatusCode.OK).json({
      data: user,
      token,
    });
  });

export const signup = () =>
  asyncHandler(async (req, res, next) => {
    // 1- create user
    const user = await UserModel.create({
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      password: req.body.password,
    });
    // 2- generate token
    const token = generateJWTToken(user._id);
    // 3- send response to client side
    res.status(HttpStatusCode.CREATED).json({
      data: user,
      token,
    });
  });

export const protectRoute = () =>
  asyncHandler(async (req, res, next) => {
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
    const decoded = verifyJWTToken(token);

    // 3) check if user exists and is active
    const currentUser = await UserModel.findById(decoded.userId);
    const { isActive } = currentUser;
    if (!currentUser || !isActive) {
      return next(
        new ApiError(
          'This user is either deactivated or deleted. Please contact support.',
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
