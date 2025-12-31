import asyncHandler from 'express-async-handler';
import {
  generateJWTToken,
  hashResetCode,
  generateResetCode,
} from '../utils/crypto-functions.js';
import { sendEmail } from '../utils/send-email.js';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import { UserModel } from '../models/user.model.js';

export const forgetPassword = () =>
  asyncHandler(async (req, res, next) => {
    // 1) Get user by email
    const user = await UserModel.findOne({ email: req.body.email });
    const isActive = user?.isActive ?? false;
    if (!user || !isActive) {
      return next(
        new ApiError(
          `No account for this email: ${req.body.email}`,
          HttpStatusCode.NOT_FOUND
        )
      );
    }
    // 2) Generate a random reset token, hash it and save it to the db
    const resetCode = generateResetCode();
    const hashedResetCode = hashResetCode(resetCode);

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

export const verifyPasswordResetCode = () =>
  asyncHandler(async (req, res, next) => {
    //1) Get user based on the reset code
    // Hash the reset code sent by the user
    const hashedResetCode = hashResetCode(req.body.resetCode);

    // Find user with the hashed reset code and check if the code has not expired
    const user = await UserModel.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new ApiError(
          'Invalid or expired reset code',
          HttpStatusCode.BAD_REQUEST
        )
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

export const resetPassword = () =>
  asyncHandler(async (req, res, next) => {
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
    const token = generateJWTToken(user._id);

    // 5) Send response to client side
    res.status(HttpStatusCode.OK).json({
      message: 'Password reset successfully',
      token,
    });
  });
