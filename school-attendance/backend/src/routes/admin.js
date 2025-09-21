const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   PUT /api/admin/reset-face
// @desc    Reset a user's face data
// @access  Private/Admin
router.put('/reset-face', protect, admin, adminController.resetFaceData);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, adminController.getAllUsers);

module.exports = router;