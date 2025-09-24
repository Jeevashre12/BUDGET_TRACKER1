import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    type: { type: String, enum: ["actual", "planned"], default: "actual" },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("transactions", transactionSchema);
export default transactionModel;


