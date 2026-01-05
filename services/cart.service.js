import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';

import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';
import { CouponModel } from '../models/coupon.model.js';

// Calculate And Update Total Cart Price
const calcAndUpdateTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  // Update cart total price
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined; // reset discount price when cart is updated
  cart.coupon = undefined; // reset coupon when cart is updated
  return totalPrice;
};

// @desc    Get Cart for logged-in user
// @route   GET /api/v1/cart
// @access  Private / User
export const getLoggedInUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError("There's no cart for this user", HttpStatusCode.NOT_FOUND)
    );
  }

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: cart,
    numberOfItems: cart.cartItems.length,
    message: 'Cart retrieved successfully',
  });
});

// @desc    Add product to cart for logged-in user
// @route   POST /api/v1/cart
// @access  Private / User
export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;
  const product = await ProductModel.findById(productId);

  // Get Cart for logged-in user
  let cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    // If user has no cart, create new cart
    cart = await CartModel.create({
      user: req.user._id,
      cartItems: [
        { product: productId, color, quantity, price: product.price },
      ],
    });
  } else {
    // Product already exists in cart (same productId and color), update quantity
    const productExists = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productExists > -1) {
      cart.cartItems[productExists].quantity += quantity || 1;
    } else {
      // Push New Product to cartItems array
      cart.cartItems.push({
        product: productId,
        color,
        quantity,
        price: product.price,
      });
    }
  }
  // Calculate cart total price
  calcAndUpdateTotalCartPrice(cart);

  // Save cart changes
  await cart.save();

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: cart,
    numberOfItems: cart.cartItems.length,
    message: 'Product added to cart successfully',
  });
});

// @desc    Update product quantity in cart for logged-in user
// @route   PUT /api/v1/cart/:itemId
// @access  Private / User
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError("There's no cart for this user", HttpStatusCode.NOT_FOUND)
    );
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.id
  );
  if (itemIndex === -1) {
    return next(
      new ApiError('Product not found in cart', HttpStatusCode.NOT_FOUND)
    );
  }
  cart.cartItems[itemIndex].quantity = quantity;

  // Recalculate total cart price
  calcAndUpdateTotalCartPrice(cart);

  await cart.save();

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: cart,
    numberOfItems: cart.cartItems.length,
    message: 'Cart item quantity updated successfully',
  });
});

// @desc    Remove product from cart for logged-in user
// @route   DELETE /api/v1/cart/:itemId
// @access  Private / User
export const removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );

  calcAndUpdateTotalCartPrice(cart);
  await cart.save();

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: cart,
    numberOfItems: cart.cartItems.length,
    message: 'Product removed from cart successfully',
  });
});

// @desc    Clear cart for logged-in user
// @route   DELETE /api/v1/cart
// @access  Private / User
export const clearCart = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });

  res.status(HttpStatusCode.NO_CONTENT).send();
});

// @desc Apply coupon to cart for logged-in user
// @route PUT /api/v1/cart/apply-coupon
// @access Private / User
export const applyCouponToCart = asyncHandler(async (req, res, next) => {
  // 1) Get Coupon By Name
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expireAt: { $gt: Date.now() },
  });
  console.log('HEY');
  if (!coupon) {
    return next(
      new ApiError('Invalid or Expired Coupon', HttpStatusCode.NOT_FOUND)
    );
  }

  // 2) Get User's Cart
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError("There's no cart for this user", HttpStatusCode.NOT_FOUND)
    );
  }

  // 3) Calculate the discount amount & update cart total price
  let discountAmount = (cart.totalCartPrice * coupon.discount) / 100;
  // Make sure discount amount does not exceed maximumDiscountAmount if specified
  if (coupon.maximumDiscountAmount) {
    discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
  }
  cart.totalPriceAfterDiscount = (cart.totalCartPrice - discountAmount).toFixed(
    2
  );
  cart.coupon = coupon.name;

  await cart.save();

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: cart,
    numberOfItems: cart.cartItems.length,
    message: 'Coupon applied to cart successfully',
  });
});
