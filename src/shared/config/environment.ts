import { z } from 'zod';
import zennv from 'zennv';

const schema = z.object({
	NODE_ENV: z.string().default('development'),
	PORT: z.number().default(3000),
	SALT_ROUNDS: z.number().default(10),
	JWT_SECRET: z.string().default('secret'),
	JWT_EXPIRATION: z.string().default('15m'),
	COOKIE_SECRET: z.string().default('secret'),
	SESSION_SECRET: z.string().default('secret'),
	CORS_ORIGIN: z.string().default('http://localhost:3000'),
	MONGODB_URI: z.string().default('mongodb://localhost:27017/test'),
});

export const env = zennv({
	schema,
	dotenv: true,
	data: process.env,
});

class Environment {
	private readonly schema: z.ZodObject<any>;
	private readonly env: z.infer<typeof this.schema>;

	constructor() {
		this.schema = z.object({
			NODE_ENV: z.string().default('development'),
			PORT: z.number().default(3000),
			SALT_ROUNDS: z.number().default(10),
			JWT_SECRET: z.string().default('secret'),
			JWT_EXPIRATION: z.string().default('15m'),
			COOKIE_SECRET: z.string().default('secret'),
			SESSION_SECRET: z.string().default('secret'),
			CORS_ORIGIN: z.string().default('http://localhost:3000'),
			MONGODB_URI: z
				.string()
				.default('mongodb://localhost:27017/test'),
			ROOT_EMAIL: z.string().default('root@mail.com'),
			ROOT_PASSWORD: z.string().default('password'),
		});

		this.env = zennv({
			schema: this.schema,
			dotenv: true,
			data: process.env,
		}) as z.infer<typeof this.schema>;
	}

	public get<T>(key: keyof z.infer<typeof this.schema>): T {
		return this.env[key as string] as T;
	}
}

export default Environment;
