import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
}, { timestamps: true });

export default mongoose.models.SubCategory || mongoose.model("SubCategory", SubCategorySchema);