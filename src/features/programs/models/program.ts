import { Document, Schema, model } from 'mongoose';

export interface Program {
	name: string;
	area: Schema.Types.ObjectId;
	projects: Schema.Types.ObjectId[];
}

export interface ProgramDocument extends Program, Document {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

const programSchema = new Schema<ProgramDocument>(
	{
		name: { type: String, required: true },
		area: {
			type: Schema.Types.ObjectId,
			ref: 'Area',
			required: true,
		},
		projects: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Project',
			},
		],
	},
	{ timestamps: true, versionKey: false, collection: 'programs' },
);

const ProgramModel = model<ProgramDocument>('Program', programSchema);

export default ProgramModel;
