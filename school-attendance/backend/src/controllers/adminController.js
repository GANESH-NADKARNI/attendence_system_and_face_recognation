const db = require('../config/db');

// Get all users for the admin dashboard
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.user_id, u.uid, u.first_name, u.last_name, u.email, r.role_name, u.is_face_enrolled
             FROM users u
             JOIN roles r ON u.role_id = r.role_id
             ORDER BY r.role_name, u.last_name`
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
    try {
        const [subjects] = await db.query('SELECT * FROM subjects ORDER BY subject_name');
        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Server error' });
    }
};