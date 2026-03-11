import mongoose, { Schema, model, models } from "mongoose";

const SubCategorySchema = new Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  name: {
    en: { type: String, required: true },
    bn: { type: String, default: "" },
    ar: { type: String, default: "" },
    es: { type: String, default: "" },
    zh: { type: String, default: "" },
    fr: { type: String, default: "" },
  },
  slug: { type: String, required: true, unique: true },
  description: {
    en: { type: String, default: "" },
    bn: { type: String, default: "" },
    ar: { type: String, default: "" },
    es: { type: String, default: "" },
    zh: { type: String, default: "" },
    fr: { type: String, default: "" },
  },
  image: { type: String },
}, { timestamps: true });

export default models.SubCategory || model("SubCategory", SubCategorySchema);