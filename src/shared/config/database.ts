import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

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

export default mongoose;
