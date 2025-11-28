const User = require('../models/User');

// Get all users (for adding to groups)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('username email profile location interests')
      .limit(50);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user location
const updateLocation = async (req, res) => {
  try {
    const { coordinates, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        location: {
          type: 'Point',
          coordinates,
          address
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user interests
const updateInterests = async (req, res) => {
  try {
    const { interests } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { interests },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update interests error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'profile.firstName': firstName,
        'profile.lastName': lastName,
        'profile.bio': bio
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  updateLocation,
  updateInterests,
  updateProfile
};