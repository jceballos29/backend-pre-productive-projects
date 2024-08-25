import { Request, Response } from 'express';
import { BaseRouter } from '../../../shared/base';
import { authenticate, validate } from '../../../shared/middleware';
import AuthController from '../controllers/auth.controller';
import { loginSchema } from '../validations/auth.validation';

class AuthRoutes extends BaseRouter {
	constructor(
		private controller: AuthController = new AuthController(),
	) {
		super();
	}

	routes(): void {
		this.router.post(
			'/login',
			validate(loginSchema),
			(req: Request, res: Response) =>
				this.controller.login(req, res),
		);

		this.router.post(
			'/refresh',
			authenticate,
			(req: Request, res: Response) =>
				this.controller.refresh(req, res),
		);

		this.router.post(
			'/logout',
			authenticate,
			(req: Request, res: Response) =>
				this.controller.logout(req, res),
		);

		this.router.get(
			'/me',
			authenticate,
			(req: Request, res: Response) => this.controller.me(req, res),
		);
	}
}

export default AuthRoutes;
