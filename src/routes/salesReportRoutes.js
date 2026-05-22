import express from "express";
import { saveReports, getReports, deleteTransactionRow } from "../controllers/salesReportController.js";

const router = express.Router();

router.post("/bulk", saveReports);
router.get("/", getReports);
router.delete("/:id", deleteTransactionRow);

export default router;