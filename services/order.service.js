import stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode, ApiError } from '../utils/api-error.js';
import * as factory from './handlers/handlers-factory.js';
import { OrderModel } from '../models/order.model.js';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';
import { UserModel } from '../models/user.model.js';

// Initialize Stripe
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeKey);

// @desc   Create Cash Order
// @route  POST /api/v1/orders/:cartId
// @access Private / Logged-in User
export const createCashOrder = asyncHandler(async (req, res, next) => {
  // App Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart based on cartId
  console.log(req.params.cartId);
  const cart = await CartModel.findById(req.params.cartId);
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

// @desc   Get Checkout Session from Stripe
// @route  GET /api/v1/orders/checkout/:cartId
// @access Private / User
export const getCheckoutSession = asyncHandler(async (req, res, next) => {
  // App Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart based on cartId
  const cart = await CartModel.findById(req.params.cartId);
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

  // 3) Create stripe checkout session
  const session = await stripeInstance.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `E-Commerce Order - ${req.user.name}`,
          },
          unit_amount: orderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: {
      address: JSON.stringify(req.body.shippingAddress),
      coupon: cartCoupon,
    },
  });

  // 4) Send session as response
  res.status(HttpStatusCode.OK).json({
    status: 'success',
    session_url: session.url,
    session,
  });
});

//
export const createOrder = async (session) => {
  const cartId = session.client_reference_id;
  const email = session.customer_email;
  const shippingAddress = JSON.parse(session.metadata.address);
  const coupon = session.metadata.coupon;
  const orderPrice = session.amount_total / 100;

  const cart = await CartModel.findById(cartId);
  const user = await UserModel.findOne({ email });

  // Create order with default payment method "Cash"
  const order = await OrderModel.create({
    user: user._id,
    orderItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    coupon,
    shippingAddress,
    paymentMethod: 'card',
    isPaid: true,
    paidAt: Date.now(),
  });

  // Decrease product quantity, increase product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions);

    // Clear LoggedIn User cart
    await CartModel.findByIdAndDelete(cart._id);
  }
};

export const webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    // Create Order
    const session = event.data.object;
    createCashOrder(session);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});
