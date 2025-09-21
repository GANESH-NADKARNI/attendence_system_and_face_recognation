const db = require('../config/db.js');

exports.startClass = async (req, res) => {
    const teacherId = req.user.id;
    const { subjectId } = req.body;

    if (!subjectId) {
        return res.status(400).json({ message: 'Subject ID is required.' });
    }

    try {
        // Deactivate any previous active classes for this teacher
        await db.query('UPDATE classes SET is_active = FALSE, end_time = NOW() WHERE teacher_id = ? AND is_active = TRUE', [teacherId]);

        // Create a new class
        const newClass = {
            teacher_id: teacherId,
            subject_id: subjectId,
            is_active: true
        };
        const [result] = await db.query('INSERT INTO classes SET ?', newClass);
        
        res.status(201).json({ 
            message: 'Class started successfully.',
            classId: result.insertId 
        });
    } catch (error) {
        console.error("Error starting class:", error);
        res.status(500).json({ message: 'Server error while starting class.' });
    }
};

exports.endClass = async (req, res) => {
    const teacherId = req.user.id;
    const { classId } = req.body;

    if (!classId) {
        return res.status(400).json({ message: 'Class ID is required to end the class.' });
    }

    try {
        await db.query('UPDATE classes SET is_active = FALSE, end_time = NOW() WHERE class_id = ? AND teacher_id = ?', [classId, teacherId]);
        res.status(200).json({ message: 'Class ended successfully.' });
    } catch (error) {
        console.error("Error ending class:", error);
        res.status(500).json({ message: 'Server error while ending class.' });
    }
};

// --- This function remains to find the active class for students ---
exports.getActiveClass = async (req, res) => {
    // ... no changes needed here
};