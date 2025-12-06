import { Schema, model } from 'mongoose';
import { IGrade } from '../../shared/interfaces/grade.interface';

const GradeSchema = new Schema<IGrade>(
    {
        studentName: { type: String, required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true } as any,
        score: { type: Number, required: true, min: 0, max: 5 }
    },
    { timestamps: true }
);

export const GradeModel = model<IGrade>("Grade", GradeSchema);