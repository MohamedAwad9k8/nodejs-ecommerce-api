import mongoose from 'mongoose';

// 1- Create Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
      country: String,
    },
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalOrderPrice: { type: Number, default: 0 },
    coupon: String,
    paymentMethod: { type: String, enum: ['card', 'cash'], default: 'cash' },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

// Mongoose Middleware to populate user and order items on find queries
orderSchema.pre(/^find/, function () {
  this.populate({ path: 'user', select: 'name  profileImg email phone' });
  this.populate({
    path: 'orderItems.product',
    select: 'title imageCover',
  });
});

// 2- Create Model
export const OrderModel = mongoose.model('Order', orderSchema);
