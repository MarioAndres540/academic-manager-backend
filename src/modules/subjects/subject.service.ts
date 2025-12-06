import { ISubject } from "../../shared/interfaces/subject.interface";
import { SubjectModel } from "./subject.model";
import ExcelJS from "exceljs";
import { Response } from "express";

export const subjectService = {
    async create(data: any) {
        return await SubjectModel.create(data);
    },

    async findAll() {
        return SubjectModel.find().sort({ createdAt: -1 });
    },

    async findById(id: string) {
        return await SubjectModel.findById(id);
    },

    async update(id: string, data: Partial<ISubject>) {
        return await SubjectModel.findByIdAndUpdate(id, data, { new: true });
    },

    async delete(id: string) {
        return await SubjectModel.findByIdAndDelete(id);
    },

    async generateExcel(res: Response) {
        try {
            const subjects = await SubjectModel.find().sort({ createdAt: -1 });

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Subjects");

            sheet.columns = [
                { header: "ID", key: "_id", width: 30 },
                { header: "Name", key: "name", width: 25 },
                { header: "Description", key: "description", width: 40 },
                { header: "Created At", key: "createdAt", width: 20 },
            ];

            subjects.forEach((sub) => {
                sheet.addRow({
                    _id: sub._id.toString(),
                    name: sub.name,
                    description: sub.description,
                    createdAt: sub.createdAt?.toISOString().split("T")[0],
                });
            });

            res.setHeader("Content-Type", "application/vnd.openxmlformats");
            res.setHeader("Content-Disposition", "attachment; filename=subjects.xlsx");

            await workbook.xlsx.write(res);
            res.end();
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }


    }
};