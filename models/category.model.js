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

const setImageUrl = (doc) => {
  // Modify the image field to include the full URL path
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// Mongoose Post Middleware to modify the image field after retrieving a document
// findOne, findAll, update
categorySchema.post('init', (doc) => {
  setImageUrl(doc);
});
// create
categorySchema.post('save', (doc) => {
  setImageUrl(doc);
});

// 2- Create Model
export const CategoryModel = mongoose.model('Category', categorySchema);
