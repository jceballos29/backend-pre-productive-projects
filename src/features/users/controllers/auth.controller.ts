import { Request, Response } from 'express';
import {
	HttpResponse,
	JsonWebToken,
	Password,
} from '../../../shared/utils';
import UserService from '../services/user.service';

class AuthController {
	constructor(
		private readonly service: UserService = new UserService(),
		private readonly httpResponse = new HttpResponse(),
		private readonly jwt: JsonWebToken = new JsonWebToken(),
		private readonly password: Password = new Password(),
	) {}

	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await this.service.findByEmail(email);
			if (!user) {
				return this.httpResponse.NotFound(res, 'Invalid credentials');
			}

			const isMatch = await this.password.compare(
				password,
				user.password,
			);
			if (!isMatch) {
				return this.httpResponse.Unauthorized(
					res,
					'Invalid credentials',
				);
			}

			req.session.userId = user._id;
			const accessToken = this.jwt.sign({
				sub: user._id,
				iss: 'http:/localhost:3000',
				aud: 'productive-projects',
				role: user.role,
			});
			const refreshToken = this.service.generateId();

			user.refreshToken = refreshToken;
			await user.save();

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite:
					process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			});
			return this.httpResponse.Ok(res, { accessToken });
		} catch (error) {
			this.httpResponse.InternalServerError(res, error as Error);
		}
	}

	async refresh(req: Request, res: Response) {
		try {
			const { refreshToken } = req.cookies;
			if (!refreshToken) {
				return this.httpResponse.Unauthorized(
					res,
					'Invalid credentials',
				);
			}

			const user = await this.service.findOne({ refreshToken });
			if (!user) {
				return this.httpResponse.Unauthorized(
					res,
					'Invalid credentials',
				);
			}

			const accessToken = this.jwt.sign({
				sub: user._id,
				iss: 'http:/localhost:3000',
				aud: 'productive-projects',
				role: user.role,
			});
			const newRefreshToken = this.service.generateId();

			await this.service.update(
				{ _id: user._id },
				{ refreshToken: newRefreshToken },
			);

			res.cookie('refreshToken', newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite:
					process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			});
			return this.httpResponse.Ok(res, { accessToken });
		} catch (error) {
			this.httpResponse.InternalServerError(res, error as Error);
		}
	}

	async logout(req: Request, res: Response) {
		try {
			const user = await this.service.findOne({
				_id: req.session.userId,
			});
			if (!user) {
				return this.httpResponse.Unauthorized(
					res,
					'Invalid credentials',
				);
			}

			await this.service.update(
				{ _id: user._id },
				{ refreshToken: null },
			);

			req.session.destroy((error) => {
				if (error) {
					return this.httpResponse.InternalServerError(res, error);
				}
				res.clearCookie('refreshToken');
				return this.httpResponse.NoContent(res);
			});
		} catch (error) {
			this.httpResponse.InternalServerError(res, error as Error);
		}
	}

	async me(req: Request, res: Response) {
		try {
			const user = await this.service.findOne({
				_id: req.session.userId,
			});
			if (!user) {
				return this.httpResponse.Unauthorized(
					res,
					'Invalid credentials',
				);
			}
			return this.httpResponse.Ok(res, user);
		} catch (error) {
			this.httpResponse.InternalServerError(res, error as Error);
		}
	}
}

export default AuthController;
