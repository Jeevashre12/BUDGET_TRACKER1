import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    month: { type: String, required: true }, // YYYY-MM
    category: { type: String, required: true },
    budget: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, month: 1, category: 1 }, { unique: true });

const budgetModel = mongoose.model("budgets", budgetSchema);
export default budgetModel;


