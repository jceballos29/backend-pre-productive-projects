import { Request, Response } from 'express';
import { HttpResponse } from '../../../shared/utils';
import UserService from '../services/user.service';

class UserController {
	constructor(
		private readonly service: UserService = new UserService(),
		private readonly httpResponse = new HttpResponse(),
	) {}

	async createUser(req: Request, res: Response) {
		try {
			const user = await this.service.create(req.body);
			return this.httpResponse.Created(res, user);
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error);
		}
	}

	async getOneUser(req: Request, res: Response) {
		try {
			const user = await this.service.findOne({ _id: req.params.id });
			if (!user) {
				return this.httpResponse.NotFound(res, 'User not found');
			}
			return this.httpResponse.Ok(res, user);
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error);
		}
	}

	async getManyUsers(req: Request, res: Response) {
		try {
			const {
				all = false,
				page = 1,
				limit = 10,
				sort = 'name',
				order = 'asc',
			} = req.query;
			const query = req.query.search
				? { name: { $regex: req.query.search, $options: 'i' } }
				: {};
			const count = await this.service.count(query);
			const users = await this.service.findAll(query, undefined, {
				all: Boolean(all),
				lean: true,
				page: Number(page),
				limit: Number(limit),
				sort: String(sort),
				order: order as 'asc' | 'desc',
			});
			return this.httpResponse.Ok(res, { count, users });
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error);
		}
	}

	async updateUser(req: Request, res: Response) {
		try {
			const user = await this.service.update(
				{ _id: req.params.id },
				req.body,
			);
			if (!user) {
				return this.httpResponse.NotFound(res, 'User not found');
			}
			return this.httpResponse.Ok(res, user);
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error);
		}
	}

	async deleteUser(req: Request, res: Response) {
		try {
			const user = await this.service.delete({ _id: req.params.id });
			if (!user) {
				return this.httpResponse.NotFound(res, 'User not found');
			}
			return this.httpResponse.NoContent(res);
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error);
		}
	}
}

export default UserController;
