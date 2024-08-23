import { Request, Response } from 'express';
import {
	comparePassword,
	HttpResponse,
	signToken,
} from '../../../shared/utils';
import UserService from '../services/user.service';

class AuthController {
	constructor(
		private readonly service: UserService = new UserService(),
		private readonly httpResponse = new HttpResponse(),
	) {}

	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await this.service.findByEmail(email);
			if (!user) {
				return this.httpResponse.NotFound(res, 'Invalid credentials');
			}

			const isMatch = await comparePassword(password, user.password);
			if (!isMatch) {
				return this.httpResponse.Unauthorized(
					res,
					'Invalid credentials',
				);
			}

			req.session.userId = user._id;
			const accessToken = signToken({
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
			this.httpResponse.InternalServerError(res, error);
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

			const accessToken = signToken({
				sub: user._id,
				iss: 'http:/localhost:3000',
				aud: 'productive-projects',
				role: user.role,
			});
			const newRefreshToken = this.service.generateId();

			user.refreshToken = newRefreshToken;
			await user.save();

			res.cookie('refreshToken', newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite:
					process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			});
			return this.httpResponse.Ok(res, { accessToken });
		} catch (error) {
			this.httpResponse.InternalServerError(res, error);
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

			user.refreshToken = null;
			await user.save();

			req.session.destroy((error) => {
				if (error) {
					return this.httpResponse.InternalServerError(res, error);
				}
				res.clearCookie('refreshToken');
				return this.httpResponse.NoContent(res);
			});
		} catch (error) {
			this.httpResponse.InternalServerError(res, error);
		}
	}

  async me(req: Request, res: Response) {
    try {
      const user = await this.service.findOne({ _id: req.session.userId });
      if (!user) {
        return this.httpResponse.Unauthorized(res, 'Invalid credentials');
      }
      return this.httpResponse.Ok(res, user);
    } catch (error) {
      this.httpResponse.InternalServerError(res, error);
    }
  }
}
