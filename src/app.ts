import connectMongo from 'connect-mongodb-session';
import cookies from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import http, { Server } from 'http';

import features from './features';
import { Role } from './features/users/models/user';
import { Database, Environment, Logger } from './shared/config';
import { HttpResponse, Password } from './shared/utils';

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

	constructor(
		private readonly env: Environment = new Environment(),
		private readonly logger: Logger = new Logger(),
		private readonly database: Database = new Database(),
		private readonly httpResponse: HttpResponse = new HttpResponse(),
		private readonly password: Password = new Password(),
	) {
		this.app = express();
		this.app.set('port', this.env.get<number>('PORT'));
		this.server = http.createServer(this.app);
		this.startTime = Date.now();
		this.store = new MongoDBStore({
			uri: this.env.get<string>('MONGODB_URI'),
			collection: 'sessions',
		});
		this.middleware();
		this.routes();
	}

	private async createRootUser() {
		try {
			const database = this.database.getConnection();
			if (database) {
				const rootUser = await database.models.User.findOne({
					email: this.env.get<string>('ROOT_EMAIL'),
				});
				if (!rootUser) {
					await database.models.User.create({
						email: this.env.get<string>('ROOT_EMAIL'),
						password: await this.password.hash(
							this.env.get<string>('ROOT_PASSWORD'),
						),
						displayName: 'Root User',
						role: Role.ADMIN,
						isAdmin: true,
						isActivated: true,
					});
					this.logger.info('Root user created');
				} else {
					this.logger.info('Root user already exists');
				}
			}
		} catch (error) {
			console.log(error);
			this.logger.error('Error creating root user', error);
		}
	}

	protected middleware() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(
			cors({
				origin: this.env.get<string>('CORS_ORIGIN'),
				credentials: true,
			}),
		);
		this.app.use(cookies(this.env.get<string>('COOKIE_SECRET')));
		this.app.use(helmet());
		this.app.use(
			session({
				secret: this.env.get<string>('SESSION_SECRET'),
				resave: false,
				saveUninitialized: true,
				store: this.store,
				cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
			}),
		);
	}

	protected routes() {
		this.app.use((req: Request, res: Response, next: Function) => {
			const start = Date.now();
			const { method, url } = req;

			res.on('finish', () => {
				const elapsed = Date.now() - start;
				const { statusCode, statusMessage } = res;
				this.logger.debug(
					`${method} ${url} - ${statusCode} - ${statusMessage} - ${elapsed}ms`,
				);
			});
			next();
		});

		this.app.get('/health', (_req: Request, res: Response) => {
			const database = this.database.getConnection();
			const uptime = Math.floor((Date.now() - this.startTime) / 1000);
			if (database) {
				return this.httpResponse.Ok(res, {
					status: 'healthy',
					uptime: `${uptime}s`,
					database: database.connection.name,
				});
			}
			return this.httpResponse.InternalServerError(res, {
				message: 'Health check failed',
			} as Error);
		});

		this.app.use('/api', features);

		this.app.use((_req: Request, res: Response) => {
			return this.httpResponse.NotFound(res, {
				message: 'Resource not found',
			});
		});
	}

	public start() {
		this.server.listen(this.app.get('port'), async () => {
			try {
				this.logger.info(
					`Starting server in ${this.env.get<string>(
						'NODE_ENV',
					)} mode`,
				);
				await this.database.connect();
				await this.createRootUser();
				this.logger.info(
					`Server listening on port ${this.app.get('port')}`,
				);
			} catch (error) {
				this.logger.error('Error starting server');
				process.exit(1);
			}
		});
	}

	public async stop(signal: string) {
		this.logger.info(`Received signal: ${signal}`);
		await this.database.disconnect();
		process.exit(0);
	}
}

export default ServerBootstrap;
