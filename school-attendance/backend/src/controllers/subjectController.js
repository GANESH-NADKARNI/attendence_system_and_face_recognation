const db = require('../config/db.js');

// Get all subjects for the registration form
exports.getAllSubjects = async (req, res) => {
    try {
        const [subjects] = await db.query('SELECT * FROM subjects ORDER BY subject_name');
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Server error' });
    }
};