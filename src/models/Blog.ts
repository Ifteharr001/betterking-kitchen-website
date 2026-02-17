import mongoose, { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    category: { type: String, required: true }, 
    location: { type: String, required: false }, 
    shortDesc: { type: String, required: true }, 
    description: { type: String, required: true }, 
  },
  { timestamps: true } 
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;