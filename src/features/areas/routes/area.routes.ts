import { Request, Response } from 'express';
import { BaseRouter } from '../../../shared/base';
import { validate } from '../../../shared/middleware';
import AreaController from '../controllers/area.controller';
import {
	createAreaSchema,
	deleteAreaSchema,
	getManyAreasSchema,
	getOneAreaSchema,
	updateAreaSchema,
} from '../validations/area.validations';

class AreaRoutes extends BaseRouter {
	constructor(
		private controller: AreaController = new AreaController(),
	) {
		super();
	}

	routes(): void {
		this.router.post(
			'/',
			validate(createAreaSchema),
			(req: Request, res: Response) =>
				this.controller.createArea(req, res),
		);
		this.router.get(
			'/:id',
			validate(getOneAreaSchema),
			(req: Request, res: Response) =>
				this.controller.getOneArea(req, res),
		);
		this.router.get(
			'/',
			validate(getManyAreasSchema),
			(req: Request, res: Response) =>
				this.controller.getManyAreas(req, res),
		);
		this.router.put(
			'/:id',
			validate(updateAreaSchema),
			(req: Request, res: Response) =>
				this.controller.updateArea(req, res),
		);
		this.router.delete(
			'/:id',
			validate(deleteAreaSchema),
			(req: Request, res: Response) =>
				this.controller.deleteArea(req, res),
		);
	}
}

export default AreaRoutes;
