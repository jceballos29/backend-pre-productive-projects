import { NextFunction, Request, Response } from 'express';
import {
  FieldValidationError,
  ValidationChain,
  ValidationError,
  validationResult,
} from 'express-validator';
import { Logger } from '../config';
import { HttpResponse } from '../utils';

export const validate =
(validation: ValidationChain[]) =>
async (req: Request, res: Response, next: NextFunction) => {
  const logger = new Logger();
  const httpResponse = new HttpResponse();
  try {
    await Promise.all(validation.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors: { [key: string]: string } = {};
    errors.array().map((err: ValidationError) => {
      logger.error(err.msg);
      const fieldError = err as FieldValidationError;
      return (extractedErrors[fieldError.path] = fieldError.msg);
    });
    logger.error('Validation Error', extractedErrors);
    return httpResponse.BadRequest(res, extractedErrors);
  } catch (error) {
    return httpResponse.InternalServerError(res, error);
  }
};