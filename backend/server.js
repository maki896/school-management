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
    contentSecurityPolicy: false,
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// ─── Production / Vercel Serving ──────────────────────────────────────────────
// On Vercel, static files are handled by vercel.json. 
// We only serve static files locally or on non-vercel environments.
if (!process.env.VERCEL) {
    const staticPath = path.join(__dirname, '../frontend/dist/frontend/browser');
    app.use(express.static(staticPath));
}

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

// ─── Health check / Fallback ────────────────────────────────────────────────
app.get('/api', (req, res) => {
    res.json({ message: 'School Management System API is running ✓' });
});

// Explicitly handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ msg: 'API route not found' });
});

// Single Page Application Routing (only locally)
if (!process.env.VERCEL) {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/frontend/browser/index.html'));
    });
}

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
