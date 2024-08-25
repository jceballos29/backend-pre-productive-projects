import jwt from 'jsonwebtoken';
import { Role } from '../../features/users/models/user';
import { Environment } from '../config';

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

class JsonWebToken {
	private readonly secret: string;
	private readonly expiration: string;

	constructor(private readonly env = new Environment()) {
		this.secret = this.env.get<string>('JWT_SECRET');
		this.expiration = this.env.get<string>('JWT_EXPIRATION');
	}

	public sign(payload: Payload): string {
		return jwt.sign(payload, this.secret, {
			expiresIn: this.expiration,
			algorithm: 'HS256',
		});
	}

	public verify(token: string): DecodedToken {
		return jwt.verify(token, this.secret, {
			algorithms: ['HS256'],
		}) as DecodedToken;
	}
}

export default JsonWebToken;
