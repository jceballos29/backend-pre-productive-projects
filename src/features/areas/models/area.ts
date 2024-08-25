import { Document, Schema, model } from "mongoose";

export interface Area {
	name: string;
}

export interface AreaDocument extends Area, Document {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

const areaSchema = new Schema<AreaDocument>(
	{
		name: { type: String, required: true },
	},
	{ timestamps: true, versionKey: false, collection: 'areas' },
);

const AreaModel = model<AreaDocument>('Area', areaSchema);

export default AreaModel;