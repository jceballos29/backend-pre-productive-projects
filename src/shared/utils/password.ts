import bcrypt from 'bcrypt';
import { Environment } from '../config';

class Password {
	private readonly saltRounds: number;

	constructor(private readonly env = new Environment()) {
		this.saltRounds = this.env.get<number>('SALT_ROUNDS');
	}

	public async hash(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(this.saltRounds);
		return await bcrypt.hash(password, salt);
	}

	public async compare(
		password: string,
		hash: string,
	): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}

	public async generate(length = 8): Promise<string> {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*!@#$%^&()_+-=';
		let password = '';
		for (let i = 0; i < length; i++) {
			password += characters.charAt(
				Math.floor(Math.random() * characters.length),
			);
		}
		return password;
	}
}

export default Password;
