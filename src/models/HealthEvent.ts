import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthEvent extends Document {
    memberId: mongoose.Types.ObjectId;
    category: 'Vaccination' | 'Prescription' | 'Symptom' | 'Lab Report' | 'Doctor Visit' | 'Lifestyle' | 'Vitals';
    title: string;
    data: any; // Flexible data based on category
    source: 'user_chat' | 'manual_entry' | 'ocr_scan';
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const HealthEventSchema: Schema = new Schema(
    {
        memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
        category: {
            type: String,
            enum: ['Vaccination', 'Prescription', 'Symptom', 'Lab Report', 'Doctor Visit', 'Lifestyle', 'Vitals'],
            required: true,
        },
        title: { type: String, required: true },
        data: { type: Schema.Types.Mixed },
        source: { type: String, enum: ['user_chat', 'manual_entry', 'ocr_scan'], required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.HealthEvent || mongoose.model<IHealthEvent>('HealthEvent', HealthEventSchema);
