const express = require('express');
const router = express.Router();
const { getAllSubjects } = require('../controllers/subjectController.js');

// This route is public so anyone can see the subjects when registering
router.get('/', getAllSubjects);

module.exports = router;