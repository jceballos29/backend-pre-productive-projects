import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from '../utils';
import { Role } from '../../features/users/models/user';

export const authorize =
	(roles: Role[], own: boolean = false) =>
	(req: Request, res: Response, next: NextFunction) => {
		const httpResponse = new HttpResponse();

		if (!req.session.role) {
			return httpResponse.Forbidden(res, 'Access denied');
		}

		if (roles.length && roles.includes(req.session.role)) {
			if (!own || req.params.id !== req.session.userId) {
				return httpResponse.Forbidden(res, 'Access denied');
			}
		}

		next();
	};
