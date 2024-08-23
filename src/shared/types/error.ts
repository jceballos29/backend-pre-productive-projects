export class AppError extends Error {
	public readonly message: string;
	public readonly statusCode: number;
	public readonly isOperational: boolean;

	constructor(
		message: string,
		statusCode = 500,
		isOperational = true,
	) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.isOperational = isOperational;
	}
}
