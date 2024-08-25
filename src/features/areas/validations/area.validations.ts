import { body, param, query } from 'express-validator';

export const getOneAreaSchema = [
	param('id')
		.isString()
		.withMessage('Id must be a string')
		.isMongoId()
		.withMessage('Id must be a valid Id'),
];

export const getManyAreasSchema = [
	query('all')
		.optional()
		.isBoolean()
		.withMessage('All must be a boolean'),
	query('search')
		.optional()
		.isString()
		.withMessage('Search must be a string'),
	query('limit')
		.optional()
		.isInt()
		.withMessage('Limit must be an integer'),
	query('page')
		.optional()
		.isInt()
		.withMessage('Page must be an integer'),
	query('sort')
		.optional()
		.isString()
		.withMessage('Sort must be a string'),
	query('order')
		.optional()
		.isIn(['asc', 'desc'])
		.withMessage('Order must be asc or desc'),
];

export const createAreaSchema = [
	body('name')
		.isString()
		.withMessage('Name must be a string')
		.isLength({ min: 2, max: 255 })
		.withMessage('Name must be between 2 and 255 characters long'),
];

export const updateAreaSchema = [
	param('id')
		.isString()
		.withMessage('Id must be a string')
		.isMongoId()
		.withMessage('Id must be a valid Id'),
	body('name')
		.isString()
		.withMessage('Name must be a string')
		.isLength({ min: 2, max: 255 })
		.withMessage('Name must be between 2 and 255 characters long'),
];

export const deleteAreaSchema = [
	param('id')
		.isString()
		.withMessage('Id must be a string')
		.isMongoId()
		.withMessage('Id must be a valid Id'),
];
