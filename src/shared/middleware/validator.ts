import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult, FieldValidationError, ValidationChain} from 'express-validator';
import { HttpResponse } from '../utils';
import { logger } from '../config';


export const validate =
	(validation: ValidationChain[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const httpResponse = new HttpResponse();
		try {
			await Promise.all(validation.map((v) => v.run(req)));
			const errors = validationResult(req);
			if (errors.isEmpty()) {
				return next();
			}
			const extractedErrors: { [key: string]: string } = {};
			errors.array().map((err: ValidationError) => {
				console.log(err)
				const fieldError = err as FieldValidationError;
				return (extractedErrors[fieldError.path] = fieldError.msg);
			});
			return httpResponse.BadRequest(res, extractedErrors);
		} catch (error) {
			logger.error(error);
			return httpResponse.InternalServerError(res, error);
		}
	};
