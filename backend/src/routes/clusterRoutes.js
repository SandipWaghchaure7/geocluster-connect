const express = require('express');
const router = express.Router();
const {
  clusterByLocation,
  clusterByInterest
} = require('../controllers/clusterController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/location', clusterByLocation);
router.post('/interest', clusterByInterest);

module.exports = router;