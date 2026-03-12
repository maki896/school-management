const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP to allow Angular to load correctly in single-service mode
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend/browser')));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
    res.json({ message: 'School Management System API is running ✓', version: '1.0.0' });
});

// All other routes should serve the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/frontend/browser/index.html'));
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
