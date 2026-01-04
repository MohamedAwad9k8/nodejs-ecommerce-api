import * as userHandler from './handlers/user-handlers.js';

// @desc Add Product to Wishlist
// @route POST /api/v1/wishlist
// @access Private / Logged-in User
export const addProductToWishlist = userHandler.addProductToWishlist();

// @desc Remove Product from Wishlist
// @route DELETE /api/v1/wishlist/:productId
// @access Private / Logged-in User
export const removeProductFromWishlist =
  userHandler.removeProductFromWishlist();

// @desc Get Logged-in User Wishlist
// @route GET /api/v1/wishlist
// @access Private / Logged-in User
export const getLoggedInUserWishlist = userHandler.getLoggedInUserWishlist();
