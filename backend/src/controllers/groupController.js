const Group = require('../models/Group');
const User = require('../models/User');

// Create Manual Group
const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;

    // Create group
    const group = await Group.create({
      name,
      description,
      groupType: 'manual',
      admin: req.user.id,
      members: [req.user.id, ...memberIds]
    });

    // Add group to all members
    await User.updateMany(
      { _id: { $in: group.members } },
      { $push: { groups: group._id } }
    );

    const populatedGroup = await Group.findById(group._id)
      .populate('admin', 'username profile')
      .populate('members', 'username profile');

    res.status(201).json({
      success: true,
      group: populatedGroup
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all groups for current user
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
      isActive: true
    })
      .populate('admin', 'username profile')
      .populate('members', 'username profile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      groups
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single group
const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('admin', 'username profile')
      .populate('members', 'username profile email location interests');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is member
    if (!group.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      group
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Add member to group
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is admin
    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    // Check if already member
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    group.members.push(userId);
    await group.save();

    await User.findByIdAndUpdate(userId, {
      $push: { groups: group._id }
    });

    const updatedGroup = await Group.findById(group._id)
      .populate('admin', 'username profile')
      .populate('members', 'username profile');

    res.json({
      success: true,
      group: updatedGroup
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete group
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is admin
    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can delete group' });
    }

    // Remove group from all members
    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: group._id } }
    );

    await Group.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroup,
  addMember,
  deleteGroup
};