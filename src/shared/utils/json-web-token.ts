import jwt from 'jsonwebtoken';
import { env } from '../config';
import { Role } from '../../features/users/models/user';

export type Payload = {
	sub: string;
	iss: string;
	aud: string;
	role: Role;
};

export interface DecodedToken extends Payload {
	iat: number;
	exp: number;
}

export const signToken = (payload: Payload): string => {
	return jwt.sign(payload, env.JWT_SECRET, {
		expiresIn: env.JWT_EXPIRATION,
		algorithm: 'RS256',
	});
};

export const verifyToken = (token: string): DecodedToken => {
	return jwt.verify(token, env.JWT_SECRET, {
		algorithms: ['RS256'],
	}) as DecodedToken;
};
