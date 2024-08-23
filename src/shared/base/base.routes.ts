import { Request, Response, Router } from 'express';
import { ValidationChain } from 'express-validator';
import { validate } from '../middleware';

export class BaseRouter<C> {
	public router: Router;
	public controller: C;

	constructor(Controller: { new (): C }) {
		this.router = Router();
		this.controller = new Controller();
		this.routes();
	}

	registerRoute(
		method: 'get' | 'post' | 'put' | 'delete',
		path: string,
		validations: ValidationChain[],
		handler: (req: Request, res: Response) => void,
	) {
		this.router[method](path, validate(validations), (req, res) => handler(req, res));
	}

	routes() {}
}
