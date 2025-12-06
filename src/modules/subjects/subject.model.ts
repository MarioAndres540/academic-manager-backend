import { model, Schema } from "mongoose";
import { ISubject } from "../../shared/interfaces/subject.interface";

const SubjectSchema = new Schema<ISubject>(
    {
        name: {type: String, required: true},
        description: {type: String, default: ""},
    },
    {timestamps: true}
);

export const SubjectModel = model<ISubject>("Subject", SubjectSchema);