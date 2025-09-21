const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db.js');
const authRoutes = require('./routes/auth.js');
const faceRoutes = require('./routes/faceRoutes.js');
const classRoutes = require('./routes/classRoutes.js');
const analyticsRoutes = require('./routes/analyticsRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const subjectRoutes = require('./routes/subjectRoutes.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/face', faceRoutes);
app.use('/api/class', classRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subjects', subjectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    db.query('SELECT 1')
        .then(() => console.log('MySQL Connected...'))
        .catch(err => console.error('MySQL connection error:', err));
});