import ServerBootstrap from './app';

export const main = async () => {
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
