import { mongoose } from 'mongoose';

// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: [true, 'Category name must be unique'],
      minlength: [3, 'Category name must be at least 3 characters'],
      maxlength: [32, "Category name can't exceed 32 characters"],
    },
    // A and B => a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// 2- Create Model
export const CategoryModel = mongoose.model('Category', categorySchema);
