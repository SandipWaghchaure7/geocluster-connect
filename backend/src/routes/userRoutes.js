const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateLocation,
  updateInterests,
  updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/', getAllUsers);
router.put('/location', updateLocation);
router.put('/interests', updateInterests);
router.put('/profile', updateProfile);

module.exports = router;