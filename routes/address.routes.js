import express from 'express';
import {
  addAddress,
  removeAddress,
  getLoggedInUserAddresses,
} from '../services/address.service.js';
import { protectRoute, allowedRoles } from '../services/auth.service.js';

export const AddressRouter = express.Router();

AddressRouter.use(protectRoute, allowedRoles('user'));

AddressRouter.route('/').post(addAddress).get(getLoggedInUserAddresses);

AddressRouter.route('/:addressId').delete(removeAddress);
