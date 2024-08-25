import { Request, Response } from 'express';
import { HttpResponse } from '../../../shared/utils';
import ProgramService from '../services/program.service';
import AreaService from '../../areas/services/area.service';

class AppError extends Error {
	constructor(message: string, public statusCode: number) {
		super(message);
	}
}

class ProgramController {
	constructor(
		private readonly service: ProgramService = new ProgramService(),
		private readonly areaService: AreaService = new AreaService(),
		private readonly httpResponse = new HttpResponse(),
	) {}

	async createProgram(req: Request, res: Response) {
		try {
			const area = await this.areaService.findOne({
				_id: req.body.area,
			});
			if (!area) {
				return this.httpResponse.NotFound(res, 'Area not found');
			}
			const program = await this.service.create({
				...req.body,
				area: area._id,
			});

			await this.areaService.update(
				{ _id: area._id },
				{ $addToSet: { programs: program._id } },
			);

			return this.httpResponse.Created(res, program);
		} catch (error) {
			return this.httpResponse.InternalServerError(
				res,
				error as Error,
			);
		}
	}

	async getOneProgram(req: Request, res: Response) {
		try {
			const program = await this.service.findOne(
				{ _id: req.params.id },
				{ lean: true, populate: [{ path: 'area', select: 'name' }] },
			);
			if (!program) {
				return this.httpResponse.NotFound(res, 'Program not found');
			}
			return this.httpResponse.Ok(res, program);
		} catch (error) {
			return this.httpResponse.InternalServerError(
				res,
				error as Error,
			);
		}
	}

	async getManyPrograms(req: Request, res: Response) {
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
			const programs = await this.service.findAll(query, undefined, {
				all: Boolean(all),
				lean: true,
				page: Number(page),
				limit: Number(limit),
				sort: String(sort),
				order: order as 'asc' | 'desc',
				populate: [{ path: 'area', select: 'name' }],
			});
			return this.httpResponse.Ok(res, { count, programs });
		} catch (error) {
			return this.httpResponse.InternalServerError(
				res,
				error as Error,
			);
		}
	}

	async updateProgram(req: Request, res: Response) {
		try {
			const updatedProgram = await this.service.update(
				{ _id: req.params.id },
				req.body,
			);
			if (!updatedProgram) {
				return this.httpResponse.NotFound(res, 'Program not found');
			}
			return this.httpResponse.Ok(res, updatedProgram);
		} catch (error) {
			return this.httpResponse.InternalServerError(
				res,
				error as Error,
			);
		}
	}

	async deleteProgram(req: Request, res: Response) {
		try {
			const program = await this.service.findOne({
				_id: req.params.id,
			});
			if (!program) {
				return this.httpResponse.NotFound(res, 'Program not found');
			}

			await this.areaService.update(
				{ _id: program.area },
				{ $pull: { programs: program._id } },
			);

			await this.service.delete({ _id: program._id });

			return this.httpResponse.Ok(res, program);
		} catch (error) {
			if (error instanceof AppError) {
				return this.httpResponse.NotFound(res, error.message);
			}

			return this.httpResponse.InternalServerError(
				res,
				error as Error,
			);
		}
	}
}

export default ProgramController;
