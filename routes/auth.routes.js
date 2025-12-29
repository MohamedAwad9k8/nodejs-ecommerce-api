import express from 'express';
import { login, signup } from '../services/auth.service.js';
import {
  signUpValidator,
  logInValidator,
} from '../utils/validators/auth-validator.js';

export const AuthRouter = express.Router();

AuthRouter.route('/signup').post(signUpValidator, signup);

AuthRouter.route('/login').post(logInValidator, login);
