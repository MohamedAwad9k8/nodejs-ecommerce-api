import mongoose from 'mongoose';
import { ProductModel } from './product.model.js';

// 1- Create Schema
const reviewSchema = new mongoose.Schema(
  {
    title: { type: String },
    rating: {
      type: Number,
      required: [true, 'Review rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
  },
  { timestamps: true }
);

// Pre-Middleware to populate user and product data on find queries
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name profileImg',
  });
});

// Mongo Aggregation Query to calculate average ratings and ratings quantity
// Static method to calculate average ratings and ratings quantity
reviewSchema.statics.calculateAverageRatings = async function (productId) {
  const results = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' },
      },
    },
  ]);

  if (results.length > 0) {
    // Round to 1 decimal place (e.g. 3.3333 -> 3.3)
    const roundedAvg = Math.round(results[0].ratingsAverage * 10) / 10;
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsQuantity: results[0].ratingsQuantity,
      ratingsAverage: roundedAvg,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// Post Middleware to calculate average ratings and ratings quantity after save
reviewSchema.post('save', async function () {
  // this points to current review
  await this.constructor.calculateAverageRatings(this.product);
});

// query hook for findOneAndUpdate / findByIdAndUpdate
reviewSchema.post('findOneAndUpdate', async function (doc) {
  // 'this' is the Query, 'doc' is the returned document
  // We only need the product id to recalc.
  if (doc) {
    await this.model.calculateAverageRatings(doc.product);
  }
});

// query hook for findOneAndDelete / findByIdAndDelete
reviewSchema.post('findOneAndDelete', async function (doc) {
  // 'this' is the Query, 'doc' is the deleted document (if any)
  if (doc) {
    // use this.model (the Mongoose Model) to call the static
    await this.model.calculateAverageRatings(doc.product);
  }
});

// 2- Create Model
export const ReviewModel = mongoose.model('Review', reviewSchema);
