import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../utils';

export const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  const httpResponse = new HttpResponse();
  return httpResponse.NotFound(res, 'Route not found');
};