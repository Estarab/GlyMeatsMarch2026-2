// import ProductionPlan from "../models/ProductionPlan.js";
import { ProductionPlan } from "../models/ProductionPlan.js";

export const getProductionPlans = async (req, res) => {
  const plans = await ProductionPlan.find().sort({ plannedDate: 1 });
  res.json(plans);
};

export const createProductionPlan = async (req, res) => {
  const plan = await ProductionPlan.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json(plan);
};

export const updateProductionPlan = async (req, res) => {
  const plan = await ProductionPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(plan);
};

export const deleteProductionPlan = async (req, res) => {
  await ProductionPlan.findByIdAndDelete(req.params.id);
  res.json({ message: "Plan deleted" });
};

export const markPlanCompleted = async (req, res) => {
  const plan = await ProductionPlan.findByIdAndUpdate(
    req.params.id,
    { status: "COMPLETED" },
    { new: true }
  );

  res.json(plan);
};