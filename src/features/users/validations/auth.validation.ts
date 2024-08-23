import { body, param, query } from 'express-validator';

export const loginSchema = [
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email')
    .isLength({ min: 3, max: 255 })
    .withMessage('Email must be between 3 and 255 characters long'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6, max: 255 })
    .withMessage(
      'Password must be between 6 and 255 characters long',
    ),
];