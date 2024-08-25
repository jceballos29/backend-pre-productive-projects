import { body, param, query } from 'express-validator';
import { Role } from '../models/user';

const rolesValues = Object.values(Role);

export const createUserSchema = [
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
	body('role')
		.isIn(rolesValues)
		.withMessage('Role must be a valid role'),
	body('displayName')
		.isString()
		.withMessage('Display name must be a string')
		.isLength({ min: 2, max: 255 })
		.withMessage(
			'Display name must be between 2 and 255 characters long',
		),
];

export const updateUserSchema = [
	param('id')
		.isString()
		.withMessage('Id must be a string')
		.isMongoId()
		.withMessage('Id must be a valid Id'),
	body('email')
		.optional()
		.isEmail()
		.withMessage('Email must be a valid email')
		.isLength({ min: 3, max: 255 })
		.withMessage('Email must be between 3 and 255 characters long'),
	body('password')
		.optional()
		.isString()
		.withMessage('Password must be a string')
		.isLength({ min: 6, max: 255 })
		.withMessage(
			'Password must be between 6 and 255 characters long',
		),
	body('role')
		.optional()
		.isIn(rolesValues)
		.withMessage('Role must be a valid role'),
	body('displayName')
		.optional()
		.isString()
		.withMessage('Display name must be a string')
		.isLength({ min: 2, max: 255 })
		.withMessage(
			'Display name must be between 2 and 255 characters long',
		),
	body('avatar')
		.optional()
		.isURL()
		.withMessage('Avatar must be a valid URL'),
];

export const deleteUserSchema = [
  param('id')
    .isString()
    .withMessage('Id must be a string')
    .isMongoId()
    .withMessage('Id must be a valid Id'),
];

export const getOneUserSchema = [
  param('id')
    .isString()
    .withMessage('Id must be a string')
    .isMongoId()
    .withMessage('Id must be a valid Id'),
];

export const getManyUsersSchema = [
  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string'),
  query('page')
    .optional()
    .isInt()
    .toInt()
    .default(1)
    .withMessage('Page must be an integer'),
  query('limit')
    .optional()
    .isInt()
    .toInt()
    .default(10)
    .withMessage('Limit must be an integer'),
  query('sort')
    .optional()
    .isString()
    .default('displayName')
    .withMessage('Sort must be a string'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .default('desc')
    .withMessage('Order must be asc or desc'),
];