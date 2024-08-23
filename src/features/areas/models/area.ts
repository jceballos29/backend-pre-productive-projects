import mongoose from '../../../shared/config/database';

export interface Area {
	name: string;
}

export interface AreaDocument extends Area, mongoose.Document {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

const areaSchema = new mongoose.Schema<AreaDocument>(
	{
		name: { type: String, required: true },
	},
	{ timestamps: true, versionKey: false, collection: 'areas' },
);

const AreaModel = mongoose.model<AreaDocument>('Area', areaSchema);

export default AreaModel;