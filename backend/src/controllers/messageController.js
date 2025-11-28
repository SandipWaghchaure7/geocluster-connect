const Message = require('../models/Message');
const Group = require('../models/Group');

// Get messages for a group
const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { limit = 50 } = req.query;

    // Check if user is member of group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get messages
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'username profile')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content, messageType = 'text', fileUrl } = req.body;

    // Check if user is member of group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create message
    const message = await Message.create({
      group: groupId,
      sender: req.user.id,
      content,
      messageType,
      fileUrl
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profile');

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;

    await Message.updateMany(
      { _id: { $in: messageIds } },
      {
        $addToSet: {
          isRead: {
            user: req.user.id,
            readAt: new Date()
          }
        }
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getGroupMessages,
  sendMessage,
  markAsRead,
  deleteMessage
};