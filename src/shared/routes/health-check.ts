import { Request, Response, NextFunction } from 'express';
import { databaseConnect } from '../config';
import { AppError } from '../types';

export const healthCheck =
	(startTime: number) =>
	async (_req: Request, res: Response, next: NextFunction) => {
		try {
			const database = await databaseConnect();
			const uptime = Math.floor((Date.now() - startTime) / 1000);
			res.json({
				status: 'healthy',
				uptime: `${uptime}s`,
				database: database.connection.name,
			});
		} catch (e) {
			const error = new AppError('Health check failed', 500, true);
			next(error);
		}
	};
