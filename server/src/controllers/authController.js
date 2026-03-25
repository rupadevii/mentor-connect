import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Helper: Set JWT token in cookie
const sendTokenResponse = (user, res, statusCode = 200) => {
  const token = generateToken(user._id);

  // Options for cookie
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Secure: cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
    sameSite: 'lax', // CSRF protection
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        profilePicture: user.profilePicture,
      },
    });
};

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Validation
  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // Create user
  user = await User.create({
    name,
    email,
    password,
  });

  // Send response with token
  sendTokenResponse(user, res, 201);
});

// @route   POST /auth/login
// @desc    Login user
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Check for user and get password field (normally excluded)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Send response with token
  sendTokenResponse(user, res);
});

// @route   GET /auth/me
// @desc    Get current logged-in user
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      level: user.level,
      profilePicture: user.profilePicture,
    },
  });
});
