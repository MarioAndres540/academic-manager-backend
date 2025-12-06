import { Router } from "express";
import { subjectController } from "./subject.controller";


const router = Router();

router.post("/", subjectController.create);
router.get("/", subjectController.findAll);
router.put("/:id", subjectController.update);
router.delete("/:id", subjectController.delete);
router.get("/pdf", subjectController.downloadPDF);
router.get("/export/excel", subjectController.downloadExcel);


export default router;