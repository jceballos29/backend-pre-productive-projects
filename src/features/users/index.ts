import { Request, Response } from 'express';
import { BaseRouter } from '../../shared/base';
import { validate } from '../../shared/middleware';
import UserController from './controllers/user.controller';
import {
	createUserSchema,
	deleteUserSchema,
	getManyUsersSchema,
	getOneUserSchema,
	updateUserSchema,
} from './validations/user.validation';

class UserRoutes extends BaseRouter {
	constructor(
		private controller: UserController = new UserController(),
	) {
		super();
	}

	routes(): void {
		this.router.post(
			'/',
			validate(createUserSchema),
			(req: Request, res: Response) =>
				this.controller.createUser(req, res),
		);
		this.router.get(
			'/:id',
			validate(getOneUserSchema),
			(req: Request, res: Response) =>
				this.controller.getOneUser(req, res),
		);
		this.router.get(
			'/',
			validate(getManyUsersSchema),
			(req: Request, res: Response) =>
				this.controller.getManyUsers(req, res),
		);
		this.router.put(
			'/:id',
			validate(updateUserSchema),
			(req: Request, res: Response) =>
				this.controller.updateUser(req, res),
		);
		this.router.delete(
			'/:id',
			validate(deleteUserSchema),
			(req: Request, res: Response) =>
				this.controller.deleteUser(req, res),
		);
	}
}

export default UserRoutes;
