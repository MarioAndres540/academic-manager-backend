import { subjectService } from "./subject.service";
import { io } from "../../app";
import { Request, Response } from "express";
import { generateSubjectsPDF } from "../../shared/utils/pdf.util";


export const subjectController = {
  async create(req: Request, res: Response) {
    try {
      const subject = await subjectService.create(req.body);

      io.emit("subject:created", subject);

      return res.json(subject);

    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  },

  async findAll(req, res) {
    try {
      const subjects = await subjectService.findAll();
      res.json(subjects);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "El ID es obligatorio." });
      }

      const subject = await subjectService.update(id, req.body);

      io.emit("subject:updated", subject);

      return res.json(subject);

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "El ID es obligatorio." });
      }
      await subjectService.delete(id);

      io.emit("subject:deleted", id);

      return res.json({ message: "Deleted" });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async downloadExcel(req: Request, res: Response) {
    try {
      await subjectService.generateExcel(res);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async downloadPDF(req: Request, res: Response) {
    try {
      const subjects = await subjectService.findAll();

      const doc = generateSubjectsPDF(subjects);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=subjects.pdf");

      doc.pipe(res);
      doc.end();

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

};
