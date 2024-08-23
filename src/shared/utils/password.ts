import bcrypt from 'bcrypt';
import { env } from '../config';

export const hashPassword = async (
	password: string,
): Promise<string> => {
	const salt = await bcrypt.genSalt(env.SALT_ROUNDS);
	return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
	password: string,
	hash: string,
): Promise<boolean> => await bcrypt.compare(password, hash);

export const generatePassword = async (
	length = 8,
): Promise<string> => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*!@#$%^&()_+-=';
	let password = '';
	for (let i = 0; i < length; i++) {
		password += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return password;
};
