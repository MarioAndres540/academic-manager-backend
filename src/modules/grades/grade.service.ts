import {GradeModel} from './grade.model';
import { IGrade } from '../../shared/interfaces/grade.interface';
import PDFDocument from 'pdfkit';
import ExcelJS from "exceljs";
import { Response } from 'express';

class GradeService {
     async create(data: IGrade) {
    return await GradeModel.create(data);
  }

  async findAll() {
    return await GradeModel.find().populate("subjectId").sort({ createdAt: -1 });
  }

  async findBySubject(subjectId: string) {
    return await GradeModel.find({ subjectId }).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return GradeModel.findById(id).populate("subjectId");
}

  async update(id: string, data: Partial<IGrade>) {
    return await GradeModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await GradeModel.findByIdAndDelete(id);
  }

   async generateExcel(res: Response) {
    const grades = await GradeModel.find()
      .populate("subjectId", "name")
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Grades");

    sheet.columns = [
      { header: "ID", key: "_id", width: 30 },
      { header: "Student Name", key: "studentName", width: 25 },
      { header: "Subject", key: "subjectName", width: 25 },
      { header: "Score", key: "score", width: 10 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    grades.forEach((g) => {
      sheet.addRow({
        _id: g._id.toString(),
        studentName: g.studentName,
        subjectName:
        typeof g.subjectId === "object" && g.subjectId !== null
    ? g.subjectId.name
    : "N/A",

        score: g.score,
        createdAt: g.createdAt?.toISOString().split("T")[0],
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", "attachment; filename=grades.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  }
};

export const gradeService = new GradeService();

export const generateGradePDF = (gradeData: any, res: Response) => {
    const doc = new PDFDocument({ margin: 40 });

    // Headers HTTP antes de enviar nada
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=grade-report.pdf");

    doc.pipe(res);

    // Header
    doc.fontSize(22).text("Grade Report", { align: "center" });
    doc.moveDown();

    // Student Info
    doc.fontSize(16).text(`Student: ${gradeData.studentName}`);
    doc.text(`Subject: ${gradeData.subjectId?.name || gradeData.subjectName}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Grade Table
    doc.fontSize(14).text("Grades:", { underline: true });
    doc.moveDown(0.5);

    gradeData.grades?.forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item.activityName}  -  ${item.score}`);
    });

    doc.moveDown();

    doc.fontSize(14).text(`Final Score: ${gradeData.finalScore}`);

    doc.end();
};
