import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1- Create Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String },
    profileImg: { type: String },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters long'],
    },
    passwordChangedAt: { type: Date },
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
    },
    isActive: { type: Boolean, default: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  // Only Hash the password if it has been modified or is new
  this.password = await bcrypt.hash(this.password, 12);
});

const setImageUrl = (doc) => {
  // Modify the image field to include the full URL path
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
};

// Mongoose Post Middleware to modify the image field after retrieving a document
// findOne, findAll, update
userSchema.post('init', (doc) => {
  setImageUrl(doc);
});
// create
userSchema.post('save', (doc) => {
  setImageUrl(doc);
});

// 2- Create Model
export const UserModel = mongoose.model('User', userSchema);
