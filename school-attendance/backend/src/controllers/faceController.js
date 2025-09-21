const db = require('../config/db.js');
const axios = require('axios');

// --- ENROLLMENT FUNCTION ---
exports.enrollFace = async (req, res) => {
    const { descriptor } = req.body;
    const userId = req.user.id;
    if (!descriptor) {
        return res.status(400).json({ message: 'Face descriptor is required.' });
    }
    try {
        const embeddingJson = JSON.stringify(descriptor);
        await db.query(
            'INSERT INTO face_embeddings (user_id, embedding) VALUES (?, ?) ON DUPLICATE KEY UPDATE embedding = ?',
            [userId, embeddingJson, embeddingJson]
        );
        await db.query('UPDATE users SET is_face_enrolled = TRUE WHERE user_id = ?', [userId]);
        res.status(200).json({ message: 'Face enrolled successfully.' });
    } catch (error) {
        console.error('DATABASE ERROR during face enrollment:', error);
        res.status(500).json({ message: 'Server error: Could not save face data.' });
    }
};

// --- ATTENDANCE/RECOGNITION FUNCTION ---
exports.recognizeFaceAndMarkAttendance = async (req, res) => {
    const { descriptor, classId } = req.body;
    const studentId = req.user.id;
    
    if (!descriptor || !classId) {
        return res.status(400).json({ message: 'Face descriptor and class ID are required.' });
    }

    try {
        // Step 1: Call the Python service to verify the face
        const response = await axios.post(`${process.env.FACE_SERVICE_URL}/verify`, {
            known_descriptor: descriptor,
            user_id: studentId, // Tell the service which user to check against
        });

        // Step 2: Check if the Python service confirmed a match
        if (response.data.match) {
            // Step 3: If it's a match, insert a new attendance record
            await db.query(
                'INSERT INTO attendance_records (class_id, student_id) VALUES (?, ?)',
                [classId, studentId]
            );
            
            // Step 4: Send success response to the frontend
            res.status(200).json({ 
                message: 'Attendance marked successfully.',
                firstName: req.user.firstName,
            });
        } else {
            // If it's not a match, send a verification failed error
            res.status(401).json({ message: 'Face verification failed. Please try again.' });
        }
    } catch (error) {
        console.error('Error in face recognition:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error during face recognition.' });
    }
};