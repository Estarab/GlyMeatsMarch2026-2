import express from "express";
import { saveReports, getReports, } from "../controllers/salesReportController.js";

const router = express.Router();

router.post("/bulk", saveReports);
router.get("/", getReports);

export default router;