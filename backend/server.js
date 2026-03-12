const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: 'School Management System API is running ✓', version: '1.0.0' });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ msg: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ msg: 'Internal server error' });
});

// ─── Database & Server Start ─────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✓ MongoDB Connected');
        if (require.main === module) {
            app.listen(PORT, () => {
                console.log(`✓ Server running on http://localhost:${PORT}`);
            });
        }
    })
    .catch(err => {
        console.error('✗ MongoDB connection error:', err.message);
        process.exit(1);
    });

module.exports = app;
