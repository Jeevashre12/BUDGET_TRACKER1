import transactionModel from "../models/transactionModel.js";
import budgetModel from "../models/budgetModel.js";
import mongoose from "mongoose";

// GET /api/finance/summary?year=YYYY&month=MM
// Returns totals, income vs expenses, recent transactions and budget progress
export const getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) return res.status(400).json({ success: false, message: "year and month are required" });

    const start = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
    const end = new Date(Date.UTC(Number(year), Number(month), 1));

    // Aggregate income and expenses by category
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const [totals, recent] = await Promise.all([
      transactionModel.aggregate([
        { $match: { userId: userObjectId, date: { $gte: start, $lt: end } } },
        {
          $group: {
            _id: { category: "$category", type: "$type" },
            amount: { $sum: "$amount" },
          },
        },
      ]),
      transactionModel
        .find({ userId: req.userId })
        .sort({ date: -1, createdAt: -1 })
        .limit(5),
    ]);

    let income = 0;
    let expenses = 0;
    const byCategory = {};

    for (const row of totals) {
      const cat = row._id.category;
      const type = row._id.type;
      if (!byCategory[cat]) byCategory[cat] = { income: 0, expense: 0 };
      if (type === "income") {
        byCategory[cat].income += row.amount;
        income += row.amount;
      } else {
        byCategory[cat].expense += row.amount;
        expenses += row.amount;
      }
    }

    const net = income - expenses;

    // Budgets
    const budgets = await budgetModel.find({ userId: req.userId, year: Number(year), month: Number(month) });

    const budgetProgress = budgets.map((b) => {
      const cat = b.category;
      const spent = cat === "__overall__"
        ? expenses
        : (byCategory[cat]?.expense || 0);
      const pct = b.amount > 0 ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0;
      return {
        category: cat,
        budget: b.amount,
        spent,
        remaining: Math.max(0, b.amount - spent),
        percent: pct,
      };
    });

    return res.json({
      success: true,
      income,
      expenses,
      net,
      byCategory,
      recent,
      budgetProgress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
