import { mongoose } from 'mongoose';

// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'brand name is required'],
      unique: [true, 'brand name must be unique'],
      minlength: [2, 'brand name must be at least 2 characters'],
      maxlength: [32, "brand name can't exceed 32 characters"],
    },
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// Mongoose Post Middleware to modify the image field after retrieving a document
// findOne, findAll, update
brandSchema.post('init', (doc) => {
  setImageUrl(doc);
});
// create
brandSchema.post('save', (doc) => {
  setImageUrl(doc);
});

// 2- Create Model
export const BrandModel = mongoose.model('Brand', brandSchema);
