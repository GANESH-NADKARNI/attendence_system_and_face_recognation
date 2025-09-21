const express = require('express');
const router = express.Router();
const { enrollFace, recognizeFaceAndMarkAttendance } = require('../controllers/faceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/enroll', protect, enrollFace);
router.post('/recognize', protect, recognizeFaceAndMarkAttendance);

module.exports = router;