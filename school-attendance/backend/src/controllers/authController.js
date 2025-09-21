const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, role, uid, subjectIds } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [existing] = await connection.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: 'Email already exists.' });
        }
        if (role.toLowerCase() === 'student') {
            if (!uid) {
                await connection.rollback();
                return res.status(400).json({ message: 'Student UID is required.' });
            }
            const [existingUid] = await connection.query('SELECT uid FROM users WHERE uid = ?', [uid]);
            if (existingUid.length > 0) {
                await connection.rollback();
                return res.status(409).json({ message: 'Student UID already exists.' });
            }
        }
        if (role.toLowerCase() === 'teacher' && (!subjectIds || subjectIds.length === 0)) {
            await connection.rollback();
            return res.status(400).json({ message: 'Please select at least one subject.' });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const [roleRow] = await connection.query('SELECT role_id FROM roles WHERE role_name = ?', [role]);
        if (roleRow.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Invalid role.' });
        }
        const newUser = {
            role_id: roleRow[0].role_id,
            first_name: firstName,
            last_name: lastName,
            email,
            password_hash: passwordHash,
            uid: role.toLowerCase() === 'student' ? uid : null,
        };
        const [result] = await connection.query('INSERT INTO users SET ?', newUser);
        const newUserId = result.insertId;
        if (role.toLowerCase() === 'teacher') {
            const teacherSubjectValues = subjectIds.map(subjectId => [newUserId, subjectId]);
            await connection.query('INSERT INTO teacher_subjects (teacher_id, subject_id) VALUES ?', [teacherSubjectValues]);
        }
        await connection.commit();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        await connection.rollback();
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    } finally {
        connection.release();
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const [users] = await db.query(`SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.email = ?`, [email]);
        if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials or role.' });
        
        const user = users[0];
        if (user.role_name.toLowerCase() !== role.toLowerCase()) return res.status(401).json({ message: 'Invalid credentials or role.' });
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials or role.' });
        
        const payload = {
            user: {
                id: user.user_id,
                role: user.role_name,
                isFaceEnrolled: !!user.is_face_enrolled,
                firstName: user.first_name
            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};