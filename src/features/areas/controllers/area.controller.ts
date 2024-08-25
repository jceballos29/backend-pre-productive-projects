import { Request, Response } from 'express';
import { HttpResponse } from '../../../shared/utils';
import AreaService from '../services/area.service';

class AreaController {
	constructor(
		private readonly service: AreaService = new AreaService(),
		private readonly httpResponse = new HttpResponse(),
	) {}

	async createArea(req: Request, res: Response) {
		try {
			const area = await this.service.create(req.body);
			return this.httpResponse.Created(res, area);
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error as Error);
		}
	}

	async getOneArea(req: Request, res: Response) {
		try {
			const area = await this.service.findOne({ _id: req.params.id });
			if (!area) {
				return this.httpResponse.NotFound(res, 'Area not found');
			}
			return this.httpResponse.Ok(res, area);
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error as Error);
		}
	}

	async getManyAreas(req: Request, res: Response) {
		try {
			const {
				all = true,
				page = 1,
				limit = 10,
				sort = 'name',
				order = 'asc',
			} = req.query;
			const query = req.query.search
				? { name: { $regex: req.query.search, $options: 'i' } }
				: {};
			const count = await this.service.count(query);
			const areas = await this.service.findAll(query, undefined, {
				all: Boolean(all),
				lean: true,
				page: Number(page),
				limit: Number(limit),
				sort: String(sort),
				order: order as 'asc' | 'desc',
				populate: [{ path: 'programs', select: 'name' }],
			});
			return this.httpResponse.Ok(res, { count, areas });
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error as Error);
		}
	}

	async updateArea(req: Request, res: Response) {
		try {
			const updatedArea = await this.service.update(
				{ _id: req.params.id },
				req.body,
			);
			if (!updatedArea) {
				return this.httpResponse.NotFound(res, 'Area not found');
			}
			return this.httpResponse.Ok(res, updatedArea);
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error as Error);
		}
	}

	async deleteArea(req: Request, res: Response) {
		try {
			const deletedArea = await this.service.delete({
				_id: req.params.id,
			});
			if (!deletedArea) {
				return this.httpResponse.NotFound(res, 'Area not found');
			}
			return this.httpResponse.Ok(res, deletedArea);
		} catch (error) {
			return this.httpResponse.InternalServerError(res, error as Error);
		}
	}
}

export default AreaController;
