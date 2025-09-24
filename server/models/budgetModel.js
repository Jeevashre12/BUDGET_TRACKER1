import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    category: { type: String, default: "__overall__" },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, year: 1, month: 1, category: 1 }, { unique: true });

const budgetModel = mongoose.models.budget || mongoose.model("budget", budgetSchema);
export default budgetModel;
