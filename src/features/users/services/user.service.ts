import { BaseService } from '../../../shared/base';
import UserModel, { User, UserDocument } from '../models/user';

class UserService extends BaseService<Partial<User>, UserDocument> {
	constructor() {
		super(UserModel);
	}

	async findByEmail(email: string): Promise<UserDocument | null> {
		return this.model
			.findOne({
				email,
			})
			.select('+password')
			.exec();
	}
}

export default UserService;
