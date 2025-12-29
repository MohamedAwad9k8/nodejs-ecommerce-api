import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { UserModel } from '../models/user.model.js';

const generateDummyHash = async () =>
  await bcrypt.hash('this-is-a-dummy-password', 12);

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
