import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import * as factory from './handlers/handlers-factory.js';
import { OrderModel } from '../models/order.model.js';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';

// @desc   Create Cash Order
// @route  POST /api/v1/orders/:id
// @access Private / Logged-in User
export const createCashOrder = asyncHandler(async (req, res, next) => {
  // App Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart based on cartId
  const cart = await CartModel.findById(req.params.id);
  if (!cart) {
    return next(new ApiError('Cart not found', HttpStatusCode.NOT_FOUND));
  }
  // 2) Get order price based on cart price (Check if coupon applied or not)
  let cartPrice = cart.totalCartPrice;
  let cartCoupon;
  if (cart.coupon) {
    cartPrice = cart.totalPriceAfterDiscount;
    cartCoupon = cart.coupon;
  }
  const orderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method "Cash"
  const order = await OrderModel.create({
    user: req.user.id,
    orderItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    coupon: cartCoupon,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: 'cash',
  });

  // 4) Decrease product quantity, increase product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions);

    // 5) Clear LoggedIn User cart
    await CartModel.findByIdAndDelete(cart._id);
  } else {
    return next(new ApiError(HttpStatusCode.BAD_REQUEST, 'Order not created'));
  }

  // 6) Send response to client side
  res.status(HttpStatusCode.CREATED).json({
    status: 'success',
    data: order,
  });
});

// Middleware to set userId as filterObject for logged in user
export const setUserIdFilter = (req, res, next) => {
  if (req.user.role === 'user') {
    req.filterObject = { user: req.user._id };
  }
  next();
};

// @desc   Get All Orders
// @route  GET /api/v1/orders/
// @access Private / User-Admin-Manager
export const getOrders = factory.getAll(OrderModel);

// @desc   Get Specific Order
// @route  GET /api/v1/orders/:id
// @access Private / User-Admin-Manager
export const getOrderById = factory.getOne(OrderModel);

// @desc   Update Order Status To Paid
// @route  PUT /api/v1/orders/:id/pay
// @access Private / Admin-Manager
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError('Order not found', HttpStatusCode.NOT_FOUND));
  }
  // Update order status to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: updatedOrder,
  });
});

// @desc   Update Order Status To Delivered
// @route  PUT /api/v1/orders/:id/deliver
// @access Private / Admin-Manager
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError('Order not found', HttpStatusCode.NOT_FOUND));
  }
  // Update order status to delivered
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: updatedOrder,
  });
});
