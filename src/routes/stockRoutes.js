import express from "express";
import {
  bulkUploadStock,
  getStock,
} from "../controllers/stockController.js";

const router = express.Router();

// 🔥 Sync from app (bulk offline upload)
router.post("/bulk", bulkUploadStock);

// 🔥 Fetch stock report from backend
router.get("/", getStock);

export default router;