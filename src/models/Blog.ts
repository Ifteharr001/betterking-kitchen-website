import mongoose, { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: {
      en: { type: String, required: true },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    category: {
      en: { type: String, required: true },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    location: {
      en: { type: String, required: false },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    shortDesc: {
      en: { type: String, required: true },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    description: {
      en: { type: String, required: true },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;