import transactionModel from "../models/transactionModel.js";

// List transactions (optionally by month/year)
export const listTransactions = async (req, res) => {
  try {
    const { year, month, limit = 100, skip = 0 } = req.query;
    const filter = { userId: req.userId };
    if (year && month) {
      const start = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
      const end = new Date(Date.UTC(Number(year), Number(month), 1));
      filter.date = { $gte: start, $lt: end };
    }
    const items = await transactionModel
      .find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));
    const count = await transactionModel.countDocuments(filter);
    res.json({ success: true, items, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Recent transactions
export const recentTransactions = async (req, res) => {
  try {
    const items = await transactionModel
      .find({ userId: req.userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(10);
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, note = "", date } = req.body;
    if (!type || !amount || !category || !date) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const item = await transactionModel.create({
      userId: req.userId,
      type,
      amount,
      category,
      note,
      date: new Date(date),
    });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.date) updates.date = new Date(updates.date);
    const item = await transactionModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await transactionModel.findOneAndDelete({ _id: id, userId: req.userId });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Categories (static defaults + from data)
const DEFAULT_CATEGORIES = [
  "Salary",
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Health",
  "Utilities",
  "Rent",
  "Misc"
];

export const listCategories = async (req, res) => {
  try {
    const agg = await transactionModel.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: "$category" } },
    ]);
    const fromData = agg.map((x) => x._id).filter(Boolean);
    const categories = Array.from(new Set([...DEFAULT_CATEGORIES, ...fromData]));
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
