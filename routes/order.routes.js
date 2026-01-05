import express from 'express';
import {
  createCashOrder,
  setUserIdFilter,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
} from '../services/order.service.js';

import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const OrderRouter = express.Router();

OrderRouter.use(protectRoute);

OrderRouter.route('/').get(
  allowedRoles('user', 'admin', 'manager'),
  setUserIdFilter,
  getOrders
);

OrderRouter.route('/:id')
  .post(allowedRoles('user'), createCashOrder)
  .get(allowedRoles('user', 'admin', 'manager'), setUserIdFilter, getOrderById);

OrderRouter.route('/:id/pay').put(
  allowedRoles('admin', 'manager'),
  updateOrderToPaid
);

OrderRouter.route('/:id/deliver').put(
  allowedRoles('admin', 'manager'),
  updateOrderToDelivered
);
