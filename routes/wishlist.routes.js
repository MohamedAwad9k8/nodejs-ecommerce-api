import express from 'express';
import {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedInUserWishlist,
} from '../services/wishlist.service.js';
import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const WishlistRouter = express.Router();

WishlistRouter.use(protectRoute, allowedRoles('user'));

WishlistRouter.route('/')
  .post(addProductToWishlist)
  .get(getLoggedInUserWishlist);

WishlistRouter.route('/:productId').delete(removeProductFromWishlist);
