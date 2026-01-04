import * as userHandler from './handlers/user-handlers.js';

// @desc Add Product to addresses
// @route POST /api/v1/addresses
// @access Private / Logged-in User
export const addAddress = userHandler.addAddress();

// @desc Remove Product from addresses
// @route DELETE /api/v1/addresses/:productId
// @access Private / Logged-in User
export const removeAddress = userHandler.removeAddress();

// @desc Get Logged-in User addresses
// @route GET /api/v1/addresses
// @access Private / Logged-in User
export const getLoggedInUserAddresses = userHandler.getLoggedInUserAddresses();
