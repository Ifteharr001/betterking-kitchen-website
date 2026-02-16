import mongoose from "mongoose";

const IndustrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    details: { type: String }, 
  },
  { timestamps: true }
);

const Industry = mongoose.models.Industry || mongoose.model("Industry", IndustrySchema);

export default Industry;