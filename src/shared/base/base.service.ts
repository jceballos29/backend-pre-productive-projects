import mongoose from '../config/database';

export abstract class BaseService<E, D extends mongoose.Document> {
	constructor(protected model: mongoose.Model<D>) {}

	generateId(): string {
		return new mongoose.Types.ObjectId().toHexString();
	}

	async create(data: E): Promise<D> {
		return this.model.create(data);
	}

	async findOne(
		query: mongoose.FilterQuery<D>,
		projection?: mongoose.ProjectionType<Partial<D> | string>,
		options: mongoose.QueryOptions = { lean: true },
		populates?: mongoose.PopulateOptions[],
	): Promise<Pick<D, keyof Partial<D>> | null> {
		const queryBuilder = this.model.findOne(
			query,
			projection,
			options,
		);
		if (populates) {
			populates.forEach((populate) => {
				queryBuilder.populate(populate);
			});
		}
		return queryBuilder.exec();
	}

	async findAll(
		query: mongoose.FilterQuery<D>,
		projection?: mongoose.ProjectionType<Partial<D> | string>,
		options: {
			all?: boolean;
			lean?: boolean;
			page?: number;
			limit?: number;
			sort?: string;
			order?: 'asc' | 'desc';
			populate?: mongoose.PopulateOptions[];
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
		query: mongoose.FilterQuery<D>,
		update: mongoose.UpdateQuery<D>,
		options: mongoose.QueryOptions = { new: true },
	): Promise<D | null> {
		return this.model.findOneAndUpdate(query, update, options).exec();
	}

	async delete(query: mongoose.FilterQuery<D>): Promise<D | null> {
		return this.model.findOneAndDelete(query).exec();
	}

	async count(query: mongoose.FilterQuery<D>): Promise<number> {
		return this.model.countDocuments(query).exec();
	}

	protected async withTransaction<T>(
		callback: (session: mongoose.ClientSession) => Promise<T>,
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
