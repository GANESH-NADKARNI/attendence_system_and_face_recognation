const express = require('express');
const router = express.Router();
const { getStudentAnalytics, getTeacherAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/student', protect, getStudentAnalytics);
router.get('/teacher', protect, getTeacherAnalytics);

module.exports = router;