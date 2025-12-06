import PDFDocument from "pdfkit";
import {ISubject} from "../interfaces/subject.interface";

export const generateSubjectsPDF = (subjects: ISubject[] ) => {
    const doc = new PDFDocument({margin: 40});

    doc.fontSize(18).text("Listado de Materias", {align: "center"});
    doc.moveDown();

    doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleString()}`);
    doc.moveDown();

    subjects.forEach((subject, index) => {
        doc.fontSize(14).text(`${index + 1}. ${subject.name}`, {underline: true});

        if(subject.description) {
            doc.fontSize(12).text(`Descripción: ${subject.description}`);
        }
        doc.moveDown();
    });
return doc;
};