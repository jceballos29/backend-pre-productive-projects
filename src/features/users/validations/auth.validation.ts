import { body, param, query } from 'express-validator';

export const loginSchema = [
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email'),
  body('password')
    .isString()
    .withMessage('Password must be a string'),
];