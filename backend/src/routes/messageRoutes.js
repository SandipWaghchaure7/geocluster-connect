const express = require('express');
const router = express.Router();
const {
  getGroupMessages,
  sendMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/group/:groupId', getGroupMessages);
router.post('/group/:groupId', sendMessage);
router.put('/read', markAsRead);
router.delete('/:messageId', deleteMessage);

module.exports = router;