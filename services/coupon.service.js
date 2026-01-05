import * as factory from './handlers/handlers-factory.js';
import { CouponModel } from '../models/coupon.model.js';

// @desc    Get coupons
// @route   GET /api/v1/coupons
// @access Private / Admin - Manager
export const getCoupons = factory.getAll(CouponModel);

// @desc Get Specific brand
// @route GET /api/v1/coupons/:id
// @access Private / Admin - Manager
export const getCouponById = factory.getOne(CouponModel);

// @desc    Create new coupon
// @route   POST /api/v1/coupons
// @access  Private / Admin - Manager
export const createCoupon = factory.createOne(CouponModel);

// @desc   Update coupon by ID
// @route  PUT /api/v1/coupons/:id
// @access Private / Admin - Manager
export const updateCoupon = factory.updateOne(CouponModel);

// @desc   Delete coupon by ID
// @route DELETE /api/v1/coupons/:id
// @access Private / Admin - Manager
export const deleteCoupon = factory.deleteOne(CouponModel);
