const express = require('express');
const router = express.Router();
const { startClass, endClass, getActiveClass } = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startClass);
router.post('/end', protect, endClass);
router.get('/active', protect, getActiveClass);

module.exports = router;