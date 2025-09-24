import budgetModel from "../models/budgetModel.js";

export const listBudgets = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = { userId: req.userId };
    if (month) filter.month = month;
    const budgets = await budgetModel.find(filter).sort({ updatedAt: -1 });
    return res.json({ success: true, budgets });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const upsertBudget = async (req, res) => {
  try {
    const { month, category, budget } = req.body || {};
    if (!month || !category || typeof budget !== "number") {
      return res.json({ success: false, message: "Missing fields" });
    }
    const updated = await budgetModel.findOneAndUpdate(
      { userId: req.userId, month, category },
      { $set: { budget } },
      { upsert: true, new: true }
    );
    return res.json({ success: true, budget: updated });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { month, category } = req.query;
    if (!month || !category) {
      return res.json({ success: false, message: "Month and category are required" });
    }
    const deleted = await budgetModel.findOneAndDelete({ userId: req.userId, month, category });
    return res.json({ success: true, deleted: !!deleted });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


