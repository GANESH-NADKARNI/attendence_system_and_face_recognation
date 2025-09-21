const db = require('../config/db');
const faceServiceClient = require('../services/faceServiceClient');

// Enroll User's Face
exports.enrollFace = async (req, res) => {
    const { image } = req.body;
    const userId = req.user.id;

    if (!image) {
        return res.status(400).json({ msg: 'Image is required' });
    }

    try {
        const embedding = await faceServiceClient.getEmbedding(image);

        if (!embedding) {
            return res.status(400).json({ msg: 'Could not detect a face. Please try again with better lighting.' });
        }

        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both new and existing embeddings
        const sql = `
            INSERT INTO face_embeddings (user_id, embedding) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE embedding = VALUES(embedding);
        `;
        
        await db.query(sql, [userId, JSON.stringify(embedding)]);
        await db.query('UPDATE users SET is_face_enrolled = TRUE WHERE user_id = ?', [userId]);

        res.json({ success: true, message: 'Face enrolled successfully.' });
    } catch (error) {
        console.error('Enrollment error:', error.message);
        res.status(500).send('Server error during face enrollment.');
    }
};

// Verify Attendance
exports.verifyAttendance = async (req, res) => {
    const { image, location } = req.body;
    const userId = req.user.id;

    if (!image || !location) {
        return res.status(400).json({ msg: 'Image and location are required.' });
    }

    try {
        // Get known embedding from DB
        const [rows] = await db.query('SELECT embedding FROM face_embeddings WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(400).json({ msg: 'User has not enrolled their face.' });
        }
        const known_embedding = rows[0].embedding;

        // Call face service for verification
        const isMatch = await faceServiceClient.verifyFace(image, known_embedding);

        if (isMatch) {
            // Record attendance
            await db.query('INSERT INTO attendance_records (user_id, latitude, longitude) VALUES (?, ?, ?)',
                [userId, location.lat, location.lon]
            );
            res.json({ success: true, message: 'Attendance marked successfully.' });
        } else {
            res.status(403).json({ success: false, message: 'Face does not match. Please try again.' });
        }
    } catch (error) {
        console.error('Verification error:', error.message);
        res.status(500).send('Server error during attendance verification.');
    }
};

// Get Attendance Records
exports.getAttendanceRecords = async (req, res) => {
    try {
        const [records] = await db.query(
            'SELECT record_id, check_in_time, latitude, longitude FROM attendance_records WHERE user_id = ? ORDER BY check_in_time DESC',
            [req.user.id]
        );
        res.json(records);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};