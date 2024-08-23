import connectMongo from 'connect-mongodb-session';
import cookies from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import limiter from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import http, { Server } from 'http';

import features from './features';
import { Role } from './features/users/models/user';
import { databaseConnect, env, logger } from './shared/config';
import { healthCheck, notFound } from './shared/routes';

const MongoDBStore = connectMongo(session);

declare module 'express-session' {
	interface SessionData {
		userId: string;
		role: Role;
	}
}

class ServerBootstrap {
	private app: Application;
	private server: Server;
	public startTime: number;
	private store: connectMongo.MongoDBStore;

	constructor() {
		this.app = express();
		this.server = http.createServer(this.app);
		this.startTime = Date.now();
		this.store = new MongoDBStore({
			uri: env.MONGODB_URI,
			collection: 'sessions',
		});
		this.middleware();
		this.routes();
	}

	protected middleware() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(
			cors({
				origin: env.CORS_ORIGIN,
				credentials: true,
			}),
		);
		this.app.use(cookies(env.COOKIE_SECRET));
		this.app.use(helmet());
		this.app.use(
			session({
				secret: env.SESSION_SECRET,
				resave: false,
				saveUninitialized: true,
				store: this.store,
				cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
			}),
		);
	}

	protected routes() {
		const limiterMiddleware = limiter({
			windowMs: 1000 * 60 * 15, // 15 minutes
			max: 100,
		});
		this.app.get(
			'/health',
			limiterMiddleware,
			healthCheck(this.startTime),
		);
		this.app.use('/api', features);
		this.app.use(notFound);
	}

	public start() {
		this.server.listen(env.PORT, async () => {
			try {
				const database = await databaseConnect();
				logger.info(
					`Connected to database: ${database.connection.name}`,
				);
				logger.info(`Server listening on port ${env.PORT}`);
			} catch (error) {
				logger.error('Error starting server');
				process.exit(1);
			}
		});
	}

	public async stop(signal: string) {
		logger.info(`Received signal: ${signal}`);
		await databaseConnect();
		process.exit(0);
	}
}

export default ServerBootstrap;
