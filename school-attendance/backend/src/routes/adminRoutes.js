const express = require('express');
const router = express.Router();
const { getAllUsers, getAllSubjects } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Only Admins and Moderators can access these routes
router.get('/users', protect, restrictTo('Admin', 'Moderator'), getAllUsers);
router.get('/subjects', protect, restrictTo('Admin', 'Moderator'), getAllSubjects);

module.exports = router;