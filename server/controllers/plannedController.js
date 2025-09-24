import plannedModel from "../models/plannedModel.js";

export const listPlanned = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = { userId: req.userId };
    if (month) {
      const [y, m] = month.split("-").map((v) => Number(v));
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    const planned = await plannedModel.find(filter).sort({ date: 1 });
    return res.json({ success: true, planned });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const createPlanned = async (req, res) => {
  try {
    const { category, amount, date, recurring } = req.body || {};
    if (!category || typeof amount !== "number" || !date) {
      return res.json({ success: false, message: "Missing fields" });
    }
    const doc = await plannedModel.create({
      userId: req.userId,
      category,
      amount,
      date: new Date(date),
      recurring: !!recurring,
    });
    return res.json({ success: true, planned: doc });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const updatePlanned = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, amount, category, recurring } = req.body || {};
    const update = {};
    if (date) update.date = new Date(date);
    if (typeof amount === "number") update.amount = amount;
    if (category) update.category = category;
    if (typeof recurring === "boolean") update.recurring = recurring;
    const doc = await plannedModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: update },
      { new: true }
    );
    return res.json({ success: true, planned: doc });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


