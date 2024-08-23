import { Response } from 'express';
import { HttpStatusCode } from '../types';

export class HttpResponse {
	Send<T>(
		res: Response,
		statusCode: number,
		data: T,
	): Response {
		return res.status(statusCode).json({ data });
	}

	// Éxitos
	Ok<T>(res: Response, data?: T): Response {
		return res.status(HttpStatusCode.OK).json({
			status: HttpStatusCode.OK,
			statusText: 'OK',
			data,
		});
	}

	Created<T>(res: Response, data?: T): Response {
		return res.status(HttpStatusCode.Created).json({
			status: HttpStatusCode.Created,
			statusText: 'Created',
			data,
		});
	}

	Accepted<T>(res: Response, data?: T): Response {
		return res.status(HttpStatusCode.Accepted).json({
			status: HttpStatusCode.Accepted,
			statusText: 'Accepted',
			data,
		});
	}

	NoContent(res: Response): Response {
		return res.status(HttpStatusCode.NoContent).json({
			status: HttpStatusCode.NoContent,
			statusText: 'No Content',
		});
	}

	// Errores del Cliente
	BadRequest<E>(res: Response, error?: E): Response {
		return res.status(HttpStatusCode.BadRequest).json({
			status: HttpStatusCode.BadRequest,
			statusText: 'Bad Request',
			error,
		});
	}

	Unauthorized<E>(res: Response, error?: E): Response {
		return res.status(HttpStatusCode.Unauthorized).json({
			status: HttpStatusCode.Unauthorized,
			statusText: 'Unauthorized',
			error,
		});
	}

	Forbidden<E>(res: Response, error?: E): Response {
		return res.status(HttpStatusCode.Forbidden).json({
			status: HttpStatusCode.Forbidden,
			statusText: 'Forbidden',
			error,
		});
	}

	NotFound<E>(res: Response, error?: E): Response {
		return res.status(HttpStatusCode.NotFound).json({
			status: HttpStatusCode.NotFound,
			statusText: 'Not Found',
			error,
		});
	}

	Conflict<E>(res: Response, error?: E): Response {
		return res.status(HttpStatusCode.Conflict).json({
			status: HttpStatusCode.Conflict,
			statusText: 'Conflict',
			error,
		});
	}

	// Errores del Servidor
	InternalServerError<E>(res: Response, error?: E): Response {
		return res.status(HttpStatusCode.InternalServerError).json({
			status: HttpStatusCode.InternalServerError,
			statusText: 'Internal Server Error',
			error,
		});
	}
}
