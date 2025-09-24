import salaryModel from "../models/salaryModel.js";

export const getSalary = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.json({ success: false, message: "Month is required" });
    const doc = await salaryModel.findOne({ userId: req.userId, month });
    return res.json({ success: true, salary: doc?.salary || 0 });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const upsertSalary = async (req, res) => {
  try {
    const { month, salary } = req.body || {};
    if (!month || typeof salary !== "number") {
      return res.json({ success: false, message: "Missing fields" });
    }
    const updated = await salaryModel.findOneAndUpdate(
      { userId: req.userId, month },
      { $set: { salary } },
      { upsert: true, new: true }
    );
    return res.json({ success: true, salary: updated.salary });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


