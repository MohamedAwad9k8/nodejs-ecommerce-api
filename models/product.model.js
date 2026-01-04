import { mongoose } from 'mongoose';

// 1- Create Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Title is too short'],
      maxLength: [100, 'Title is too long'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minLength: [20, 'Description is too short'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      max: [500000, 'Price is too high'],
      min: [0, 'Price can not be negative'],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'Product image cover is required'],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // Options to enable virtual populates
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

//Mongoose Query Middleware
productSchema.pre(/^find/, function () {
  this.populate({ path: 'category', select: 'name slug -_id' });
});

const setImageUrl = (doc) => {
  // Modify the image field to include the full URL path
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images && doc.images.length > 0) {
    const imagesUrls = [];
    doc.images.forEach((img) => {
      const imgUrl = `${process.env.BASE_URL}/products/${img}`;
      imagesUrls.push(imgUrl);
    });
    doc.images = imagesUrls;
  }
};

// Mongoose Post Middleware to modify the imageCover field after retrieving a document
// findOne, findAll, update
productSchema.post('init', (doc) => {
  setImageUrl(doc);
});
// create
productSchema.post('save', (doc) => {
  setImageUrl(doc);
});

// 2- Create Model
export const ProductModel = mongoose.model('Product', productSchema);
