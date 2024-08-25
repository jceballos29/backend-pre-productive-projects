import {
	Document,
	FilterQuery,
	Model,
	ProjectionType,
	QueryOptions,
	Types,
	PopulateOptions,
	ClientSession,
	UpdateQuery,
} from 'mongoose';

export abstract class BaseService<E, D extends Document> {
	constructor(protected model: Model<D>) {}

	generateId(): string {
		return new Types.ObjectId().toHexString();
	}

	async create(data: E): Promise<D> {
		return this.model.create(data);
	}

	async findOne(
		query: FilterQuery<D>,
		options: QueryOptions = { lean: true },
		projection?: ProjectionType<Partial<D> | string>,
	): Promise<Pick<D, keyof Partial<D>> | null> {
		const queryBuilder = this.model.findOne(
			query,
			projection,
			options,
		);
		return queryBuilder.exec();
	}

	async findAll(
		query: FilterQuery<D>,
		projection?: ProjectionType<Partial<D> | string>,
		options: {
			all?: boolean;
			lean?: boolean;
			page?: number;
			limit?: number;
			sort?: string;
			order?: 'asc' | 'desc';
			populate?: PopulateOptions[];
		} = { lean: true },
	): Promise<Pick<D, keyof Partial<D>>[]> {
		const queryBuilder = this.model.find(query, projection, options);
		if (options.populate) {
			options.populate.forEach((populate) => {
				queryBuilder.populate(populate);
			});
		}
		if (!options.all && options.page && options.limit) {
			queryBuilder
				.skip((options.page - 1) * options.limit)
				.limit(options.limit);
		}
		if (options.sort) {
			queryBuilder.sort({
				[options.sort]: options.order === 'asc' ? 1 : -1,
			});
		}
		return queryBuilder.exec();
	}

	async update(
		query: FilterQuery<D>,
		update: UpdateQuery<D>,
		options: QueryOptions = { new: true },
	): Promise<D | null> {
		return this.model.findOneAndUpdate(query, update, options).exec();
	}

	async delete(
		query: FilterQuery<D>,
		options: QueryOptions = {
			lean: true,
		},
	): Promise<D | null> {
		return this.model.findOneAndDelete(query, options).exec();
	}

	async count(query: FilterQuery<D>): Promise<number> {
		return this.model.countDocuments(query).exec();
	}

	async withTransaction<T>(
		callback: (session: ClientSession) => Promise<T>,
	): Promise<T> {
		const session = await this.model.db.startSession();
		session.startTransaction();

		try {
			const result = await callback(session);
			await session.commitTransaction();
			return result;
		} catch (error) {
			await session.abortTransaction();
			throw error;
		} finally {
			session.endSession();
		}
	}
}
