import mongoose from 'mongoose';
import Environment, { env } from './environment';
import Logger, { logger } from './logger';

export const databaseConnect = async (): Promise<typeof mongoose> => {
	try {
		const connection = await mongoose.connect(env.MONGODB_URI);
		return connection;
	} catch (error) {
		logger.error('Error connecting to database');
		process.exit(1);
	}
};

export const databaseDisconnect = async (): Promise<void> => {
	try {
		await mongoose.connection.close();
		logger.info('Database disconnected');
	} catch (error) {
		logger.error('Error disconnecting from database');
		process.exit(1);
	}
};

// export default mongoose;

class Database {
	private database?: mongoose.Mongoose;
	public mongoose = mongoose;

	constructor(
		private readonly env: Environment = new Environment(),
		private readonly logger: Logger = new Logger(),
	) {}

	public async connect(): Promise<void> {
		try {
			this.database = await mongoose.connect(
				this.env.get<string>('MONGODB_URI'),
			);
			this.logger.info(`Connected to database: ${this.database.connection.name}`);
		} catch (error) {
			this.logger.error('Error connecting to database');
			process.exit(1);
		}
	}

	public async disconnect(): Promise<void> {
		try {
			await mongoose.connection.close();
			this.logger.info('Database disconnected');
		} catch (error) {
			this.logger.error('Error disconnecting from database');
			process.exit(1);
		}
	}

	public getConnection(): typeof mongoose {
		if (!this.database) {
			throw new Error('Database connection not established');
		}

		return this.database;
	}
}

export default Database;