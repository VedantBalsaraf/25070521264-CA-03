import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name must be less than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z0-9]+$/, 'Roll number can only contain uppercase letters and numbers']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1, 'Year must be at least 1'],
    max: [4, 'Year must be at most 4']
  },
  avatar: {
    type: String,
    default: null
  },
  trustScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  totalBorrows: {
    type: Number,
    default: 0
  },
  totalShares: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// `email` and `rollNumber` already get unique indexes from `unique: true`
// above, so they are not declared again here (that produced duplicate-index
// warnings on every boot).
userSchema.index({ department: 1, year: 1 });

userSchema.virtual('netContribution').get(function() {
  return this.totalShares - this.totalBorrows;
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    this.password = await bcrypt.hash(this.password, config.bcryptRounds);
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;