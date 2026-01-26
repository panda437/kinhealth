import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
    userId: string; // Clerk User ID
    name: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female' | 'Other';
    bloodGroup: string;
    allergies?: string[];
    chronicConditions?: string[];
    height?: number; // In cm
    weight?: number; // In kg
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MemberSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
        bloodGroup: { type: String, required: true },
        allergies: [{ type: String }],
        chronicConditions: [{ type: String }],
        height: { type: Number },
        weight: { type: Number },
        avatar: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);
