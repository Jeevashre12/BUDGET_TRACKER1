import transactionModel from "../models/transactionModel.js";

export const listTransactions = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = { userId: req.userId };
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }
    const transactions = await transactionModel.find(filter).sort({ date: -1 });
    return res.json({ success: true, transactions });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { category, amount, date, type } = req.body || {};
    if (!category || typeof amount !== "number" || !date) {
      return res.json({ success: false, message: "Missing fields" });
    }
    const tx = await transactionModel.create({
      userId: req.userId,
      category,
      amount,
      date: new Date(date),
      type: type || "actual",
    });
    return res.json({ success: true, transaction: tx });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


