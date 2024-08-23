import ServerBootstrap from './app';
import { env, logger } from './shared/config';

export const main = async () => {
	logger.info(`Starting server in ${env.NODE_ENV} mode`);
	const server = new ServerBootstrap();

	server.start();

	const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
	signals.forEach((signal) => {
		process.on(signal, async () => {
			await server.stop(signal);
		});
	});
};

main();
