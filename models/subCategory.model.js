import { mongoose } from "mongoose";

// 1- Create Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "SubCategory name is required"],
      unique: [true, "SubCategory name must be unique"],
      minlength: [3, "SubCategory name must be at least 3 characters"],
      maxlength: [32, "SubCategory name can't exceed 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to a Category"],
    },
  },
  { timestamps: true }
);

// 2- Create Model
export const SubCategoryModel = mongoose.model(
  "SubCategory",
  subCategorySchema
);
