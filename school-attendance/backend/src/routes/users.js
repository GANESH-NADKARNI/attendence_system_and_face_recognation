const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/users/enroll-face
// @desc    Enroll the logged-in user's face
// @access  Private
router.post('/enroll-face', protect, userController.enrollFace);

// @route   POST api/users/verify-attendance
// @desc    Verify attendance for the logged-in user
// @access  Private
router.post('/verify-attendance', protect, userController.verifyAttendance);

// @route   GET api/users/attendance
// @desc    Get attendance records for the logged-in user
// @access  Private
router.get('/attendance', protect, userController.getAttendanceRecords);


module.exports = router;