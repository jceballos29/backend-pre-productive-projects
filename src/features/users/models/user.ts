import { Document, model, Schema } from "mongoose";

export enum Role {
	ADMIN = 'admin',
	COORDINATOR = 'coordinator',
	RESPONSIBLE = 'responsible',
}

export interface User {
	avatar: string | null;
	email: string;
	password: string;
	role: Role;
	displayName: string;
	resetPasswordToken: string | null;
	refreshToken: string | null;
	isActivated: boolean;
	isAdmin: boolean;
}

export interface UserDocument extends User, Document {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
	{
		avatar: { type: String, default: null },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		role: { type: String, required: true, enum: Object.values(Role) },
		displayName: { type: String, required: true },
		resetPasswordToken: {
			type: String,
			default: null,
			select: false,
		},
		refreshToken: { type: String, default: null, select: false },
		isActivated: { type: Boolean, default: false, select: false },
		isAdmin: { type: Boolean, default: false, select: false },
	},
	{ timestamps: true, versionKey: false, collection: 'users' },
);

const UserModel = model<UserDocument>('User', userSchema);

export default UserModel;
