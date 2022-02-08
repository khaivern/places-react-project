import { Router } from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user';
import User from '../models/User';

const router = Router();

router.post(
  '/login',
  [
    body('email', 'Invalid email').trim().isEmail().normalizeEmail(),
    body('password', 'Invalid Password').trim().isLength({ min: 4 }),
  ],
  userController.login
);

router.post(
  '/signup',
  [
    body('email', 'Invalid email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('E-Mail already exists');
        }
      }),
    body('password', 'Invalid Password').trim().isLength({ min: 4 }),
    body('name', 'Invalid Name').trim().not().isEmpty(),
  ],
  userController.signup
);

router.get('/users', userController.getUsers);

export default router;
