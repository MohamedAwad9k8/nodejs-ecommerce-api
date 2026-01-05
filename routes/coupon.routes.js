import express from 'express';
import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../services/coupon.service.js';

import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const CouponRouter = express.Router();

CouponRouter.use(protectRoute, allowedRoles('admin', 'manager'));

CouponRouter.route('/').get(getCoupons).post(createCoupon);
CouponRouter.route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);
