import express from "express";
import { saveReports } from "../controllers/salesReportController.js";

const router = express.Router();

router.post("/bulk", saveReports);

export default router;