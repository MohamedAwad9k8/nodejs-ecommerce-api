import express from 'express';
import {
  addProductToCart,
  getLoggedInUserCart,
  updateCartItemQuantity,
  removeProductFromCart,
  clearCart,
  applyCouponToCart,
} from '../services/cart.service.js';

import { protectRoute, allowedRoles } from '../services/auth.service.js';

// Merge params to access ProductId from parent router
export const CartRouter = express.Router();

CartRouter.use(protectRoute, allowedRoles('user'));
CartRouter.route('/')
  .get(getLoggedInUserCart)
  .post(addProductToCart)
  .delete(clearCart);

CartRouter.route('/apply-coupon').put(applyCouponToCart);

CartRouter.route('/:id')
  .put(updateCartItemQuantity)
  .delete(removeProductFromCart);
