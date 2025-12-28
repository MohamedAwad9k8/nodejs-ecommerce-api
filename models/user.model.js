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
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: { type: Boolean, default: true },
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

// 2- Create Model
export const UserModel = mongoose.model('User', userSchema);
