import { Request, Response } from "express";
import { generateGradePDF, gradeService } from "./grade.service";
import {io} from "../../app";


export class GradeController {
    async create(req: Request, res: Response) {
    try {
      const grade = await gradeService.create(req.body);

      io.emit("grade:created", grade);

      return res.status(201).json(grade);

    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const grades = await gradeService.findAll();
      return res.json(grades);

    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async findBySubject(req: Request, res: Response) {
    try {
      const { subjectId } = req.params;

      if (!subjectId)
        return res.status(400).json({ error: "subjectId es obligatorio." });

      const grades = await gradeService.findBySubject(subjectId);

      return res.json(grades);

    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID es obligatorio." });

      const grade = await gradeService.update(id, req.body);

      io.emit("grade:updated", grade);

      return res.json(grade);

    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID es obligatorio." });

      const grade = await gradeService.delete(id);

      io.emit("grade:deleted", id);

      return res.json({ message: "Deleted", id });

    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getPDF(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "ID es obligatorio." });

    const grade = await gradeService.findById(id);

    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    return generateGradePDF(grade, res);

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

async downloadExcel(req: Request, res: Response) {
    try {
      await gradeService.generateExcel(res);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

};
