import budgetModel from "../models/budgetModel.js";

// Get budgets for a given month/year
export const getBudgets = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) return res.status(400).json({ success: false, message: "year and month are required" });
    const items = await budgetModel.find({ userId: req.userId, year: Number(year), month: Number(month) });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Set/Upsert a budget for a category (or overall)
export const setBudget = async (req, res) => {
  try {
    const { year, month, category = "__overall__", amount } = req.body;
    if (!year || !month || amount == null) {
      return res.status(400).json({ success: false, message: "year, month and amount are required" });
    }
    const item = await budgetModel.findOneAndUpdate(
      { userId: req.userId, year, month, category },
      { $set: { amount } },
      { upsert: true, new: true }
    );
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
