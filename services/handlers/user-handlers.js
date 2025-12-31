import bcrypt from 'bcryptjs';

import asyncHandler from 'express-async-handler';

import {
  generateJWTToken,
  generateTempPassword,
} from '../../utils/crypto-functions.js';
import { sendEmail } from '../../utils/send-email.js';
import { HttpStatusCode, ApiError } from '../../utils/api-error.js';
import { UserModel } from '../../models/user.model.js';

// Admin Level Handlers

export const resetUserPassword = () =>
  asyncHandler(async (req, res, next) => {
    // 1) Find User By ID and save old password in memory in case of rollback
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return next(new ApiError(`user not found`, HttpStatusCode.NOT_FOUND));
    }
    const oldPassword = user.password;
    const oldPasswordChangedAt = user.passwordChangedAt;
    // 2) Generate Temp Password and Hash it
    const tempPassword = generateTempPassword(16);
    const hashedTempPassword = await bcrypt.hash(tempPassword, 12);

    // 3) update user password in DB
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      // update password field only
      {
        password: hashedTempPassword,
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return next(
        new ApiError(
          `Failed to update user password`,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
    }

    // 4) Send Email to user with the temp password
    const message =
      `Hello ${user.name},\n` +
      `Your password has been reset by admin. Your temporary password is: ${tempPassword}\n` +
      `Please log in and change your password immediately.\n` +
      'Best regards,\nE-commerce Team';
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Password Has Been Reset',
        message,
      });
    } catch (error) {
      // 5) In case of error, rollback to old password
      const rolledbackUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        { password: oldPassword, passwordChangedAt: oldPasswordChangedAt },
        { new: true }
      );
      if (!rolledbackUser) {
        return next(
          new ApiError(
            'Critical Error: Failed to rollback user password after email failure.',
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
      }
      return next(
        new ApiError(
          'There was an error sending the email. Password not updated. Try again later.',
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
    }

    // 6) Send Success response to admin
    res.status(HttpStatusCode.OK).json({
      message: `user password reseted successfully`,
    });
  });

export const deactivateUserAccount = () =>
  asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      // update isActive field only
      { isActive: false },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ApiError(`user not found`, HttpStatusCode.NOT_FOUND));
    }

    res.status(HttpStatusCode.OK).json({
      data: user,
      message: `account deactivated`,
    });
  });

// Logged-in User Handlers

export const updateLoggedInUserData = () =>
  asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        email: req.body.email,
        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.phone,
        profileImg: req.body.profileImg,
      },
      {
        new: true,
      }
    );

    res.status(HttpStatusCode.OK).json({
      data: user,
      message: `user updated successfully`,
    });
  });

export const changeLoggedUserPassword = () =>
  asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      // update password field only
      {
        password: await bcrypt.hash(req.body.newPassword, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ApiError(`user not found`, HttpStatusCode.NOT_FOUND));
    }

    // Generate New JWT token for user, as the old one is invalid after password change
    const token = generateJWTToken(user._id);

    res.status(HttpStatusCode.OK).json({
      data: user,
      message: `user password updated successfully`,
      token,
    });
  });
