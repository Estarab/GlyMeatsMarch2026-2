import express from "express";
import { getBusinessInsights } from "../controllers/businessInsights.controller.js";

const router = express.Router();

router.get("/", getBusinessInsights);

export default router;