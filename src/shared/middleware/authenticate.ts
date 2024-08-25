import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { HttpResponse, JsonWebToken } from '../utils';

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const httpResponse = new HttpResponse();
	const jwt = new JsonWebToken();

	const accessToken = req.headers.authorization?.replace(
		'Bearer ',
		'',
	);
	if (!accessToken) {
		return httpResponse.Unauthorized(res, 'Access token is required');
	}
	try {
		const decoded = jwt.verify(accessToken);
		if (!decoded) {
			return httpResponse.Unauthorized(res, 'Invalid access token');
		}
		if (!req.session.userId || req.session.userId !== decoded.sub) {
			return httpResponse.Unauthorized(res, 'Invalid access token');
		}
		req.session.role = decoded.role;
		next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return httpResponse.Unauthorized(res, 'Access token expired');
		} else if (error instanceof JsonWebTokenError) {
			return httpResponse.Unauthorized(res, 'Invalid access token');
		} else {
			return httpResponse.InternalServerError(res, error);
		}
	}
};
