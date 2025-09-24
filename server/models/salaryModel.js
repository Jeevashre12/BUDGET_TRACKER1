import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    month: { type: String, required: true }, // YYYY-MM
    salary: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

salarySchema.index({ userId: 1, month: 1 }, { unique: true });

const salaryModel = mongoose.model("salaries", salarySchema);
export default salaryModel;


