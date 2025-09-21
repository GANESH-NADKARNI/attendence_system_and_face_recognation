const db = require('../config/db.js');

// --- STUDENT ANALYTICS ---
// This function was accidentally removed and is now restored.
exports.getStudentAnalytics = async (req, res) => {
    const studentId = req.user.id;

    try {
        const query = `
            SELECT 
                s.subject_name,
                c.start_time,
                (SELECT u.first_name FROM users u WHERE u.user_id = c.teacher_id) as teacher_first_name,
                (SELECT u.last_name FROM users u WHERE u.user_id = c.teacher_id) as teacher_last_name
            FROM attendance_records ar
            JOIN classes c ON ar.class_id = c.class_id
            JOIN subjects s ON c.subject_id = s.subject_id
            WHERE ar.student_id = ?
            ORDER BY c.start_time DESC;
        `;
        const [analytics] = await db.query(query, [studentId]);
        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error fetching student analytics:', error);
        res.status(500).json({ message: 'Server error while fetching analytics.' });
    }
};

// --- TEACHER ANALYTICS ---
// This is the new function for the teacher dashboard.
exports.getTeacherAnalytics = async (req, res) => {
    const teacherId = req.user.id;

    try {
        const query = `
            SELECT 
                c.class_id,
                s.subject_name,
                c.start_time,
                COUNT(ar.record_id) as attendance_count,
                GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') as attendees
            FROM classes c
            JOIN subjects s ON c.subject_id = s.subject_id
            LEFT JOIN attendance_records ar ON c.class_id = ar.class_id
            LEFT JOIN users u ON ar.student_id = u.user_id
            WHERE c.teacher_id = ?
            GROUP BY c.class_id, s.subject_name, c.start_time
            ORDER BY c.start_time DESC;
        `;
        const [analytics] = await db.query(query, [teacherId]);
        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error fetching teacher analytics:', error);
        res.status(500).json({ message: 'Server error while fetching analytics.' });
    }
};