import mongoose from "mongoose";

const plannedSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    recurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const plannedModel = mongoose.model("plannedItems", plannedSchema);
export default plannedModel;


