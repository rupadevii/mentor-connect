import User from '../models/User.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// @route   PUT /users/profile
// @desc    Update current user profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, level, profileImage } = req.body;
  const userId = req.userId;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ message: 'Please provide name and email' });
  }

  const updateData = { name, email };

  if (level !== undefined) {
    const parsedLevel = Number(level);
    if (!Number.isInteger(parsedLevel) || parsedLevel < 1 || parsedLevel > 6) {
      return res.status(400).json({ message: 'Level must be between 1 and 6' });
    }
    updateData.level = parsedLevel;
  }

  if (profileImage) {
    updateData.profilePicture = {
      url: profileImage,
      publicId: '',
    };
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      level: user.level,
      profilePicture: user.profilePicture,
    },
  });
});
