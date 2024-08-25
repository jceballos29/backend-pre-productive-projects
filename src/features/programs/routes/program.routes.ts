import { Request, Response } from 'express';
import { BaseRouter } from '../../../shared/base';
import { validate } from '../../../shared/middleware';
import ProgramController from '../controllers/program.controller';
import {
  createProgramSchema,
  deleteProgramSchema,
  getManyProgramsSchema,
  getOneProgramSchema,
  updateProgramSchema,
} from '../validations/program.validation';

class ProgramRoutes extends BaseRouter {
	constructor(
		private controller: ProgramController = new ProgramController(),
	) {
		super();
	}

	routes(): void {
		this.router.post(
			'/',
			validate(createProgramSchema),
			(req: Request, res: Response) =>
				this.controller.createProgram(req, res),
		);
		this.router.get(
			'/:id',
			validate(getOneProgramSchema),
			(req: Request, res: Response) =>
				this.controller.getOneProgram(req, res),
		);
		this.router.get(
			'/',
			validate(getManyProgramsSchema),
			(req: Request, res: Response) =>
				this.controller.getManyPrograms(req, res),
		);
		this.router.put(
			'/:id',
			validate(updateProgramSchema),
			(req: Request, res: Response) =>
				this.controller.updateProgram(req, res),
		);
		this.router.delete(
			'/:id',
			validate(deleteProgramSchema),
			(req: Request, res: Response) =>
				this.controller.deleteProgram(req, res),
		);
	}
}

export default ProgramRoutes;
