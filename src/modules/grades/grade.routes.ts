import { Router } from "express";
import { GradeController } from "./grade.controller";
import { generateGradePDF } from "./grade.service";

const controller = new GradeController();
const router = Router();

router.post("/", controller.create.bind(controller));
router.get("/", controller.findAll.bind(controller));
router.get("/subject/:subjectId", controller.findBySubject.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
router.get("/:id/pdf", controller.getPDF.bind(controller));
router.get("/grades/excel", controller.downloadExcel.bind(controller));


export default router;