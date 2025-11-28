const express = require('express');
const router = express.Router();
const {
  createGroup,
  getMyGroups,
  getGroup,
  addMember,
  deleteGroup
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/', createGroup);
router.get('/my-groups', getMyGroups);
router.get('/:id', getGroup);
router.post('/:id/add-member', addMember);
router.delete('/:id', deleteGroup);

module.exports = router;