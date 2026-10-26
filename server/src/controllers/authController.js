import User from '../models/User.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, rollNumber, department, year } = req.body;

  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { rollNumber: rollNumber.toUpperCase() }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError('Email already registered', 400);
    }
    throw new AppError('Roll number already registered', 400);
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    rollNumber: rollNumber.toUpperCase(),
    department,
    year: parseInt(year, 10)
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: user.toPublicJSON(),
      token
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated. Please contact support.', 401);
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toPublicJSON(),
      token
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user: user.toPublicJSON() }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, department, year, avatar } = req.body;
  const updates = {};

  if (name) updates.name = name.trim();
  if (department) updates.department = department;
  if (year) updates.year = parseInt(year, 10);
  if (avatar) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: user.toPublicJSON() }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters', 400);
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});