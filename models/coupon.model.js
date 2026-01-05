import mongoose from 'mongoose';

// 1- Create Schema
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coupon name is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: [true, 'Discount percentage is required'],
    },
    expireAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
    maximumDiscountAmount: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// 2- Create Model
export const CouponModel = mongoose.model('Coupon', couponSchema);
